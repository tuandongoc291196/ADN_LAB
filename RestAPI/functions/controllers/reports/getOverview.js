const { dataConnect } = require("../../config/firebase.js");

const getOverviewReports = async (req, res) => {
  try {
    const OVERVIEW_QUERY = `
      query GetOverview @auth(level: USER) {
        testResults {
          id
          testMethod
          createdAt
          updatedAt
        }
        
        users (orderBy: {createdAt: DESC}) {
          id
          fullname
          roleId
          accountStatus
          createdAt
        }
      }
    `;

    const response = await dataConnect.executeGraphql(OVERVIEW_QUERY);
    const { testResults, users } = response.data;

    const groupByMonth = (data, valueField = null) => {
      const monthlyData = {};
      
      data.forEach(item => {
        const date = new Date(item.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthKey,
            year: date.getFullYear(),
            monthName: date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
            count: 0,
            value: 0
          };
        }
        
        monthlyData[monthKey].count++;
        if (valueField && item[valueField]) {
          monthlyData[monthKey].value += item[valueField];
        }
      });

      return Object.values(monthlyData).sort((a, b) => b.month.localeCompare(a.month));
    };

    const totalTests = testResults.length;
    const totalUsers = users.length;
    const totalCustomers = users.filter(user => user.roleId === "0").length;
    const totalStaff = users.filter(user => user.roleId === "1").length;
    const totalManagers = users.filter(user => user.roleId === "2").length;
    const totalAdmins = users.filter(user => user.roleId === "3").length;
    const activeUsers = users.filter(user => user.accountStatus === "active").length;
    const inactiveUsers = users.filter(user => user.accountStatus === "inactive").length;

    const monthlyTests = groupByMonth(testResults);
    const monthlyUsers = groupByMonth(users);
    const monthlyCustomers = groupByMonth(users.filter(user => user.roleId === "0"));

    const testMethodStats = {};
    testResults.forEach(test => {
      const method = test.testMethod || 'Unknown Method';
      testMethodStats[method] = (testMethodStats[method] || 0) + 1;
    });

    const popularTestMethods = Object.entries(testMethodStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTests = testResults.filter(test => new Date(test.createdAt) >= thirtyDaysAgo);
    const recentUsers = users.filter(user => new Date(user.createdAt) >= thirtyDaysAgo);

    const newUsers = users
      .filter(user => new Date(user.createdAt) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(user => ({
        id: user.id,
        fullname: user.fullname,
        roleId: user.roleId,
        accountStatus: user.accountStatus,
        createdAt: user.createdAt,
        roleName: user.roleId === "0" ? "Khách hàng" : 
                  user.roleId === "1" ? "Nhân viên" :
                  user.roleId === "2" ? "Quản lý" : 
                  user.roleId === "3" ? "Admin" : "Không xác định"
      }));

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const previousPeriodTests = testResults.filter(test => {
      const testDate = new Date(test.createdAt);
      return testDate >= sixtyDaysAgo && testDate < thirtyDaysAgo;
    });

    const previousPeriodUsers = users.filter(user => {
      const userDate = new Date(user.createdAt);
      return userDate >= sixtyDaysAgo && userDate < thirtyDaysAgo;
    });

    const testGrowth = previousPeriodTests.length > 0 
      ? (((recentTests.length - previousPeriodTests.length) / previousPeriodTests.length) * 100).toFixed(1)
      : recentTests.length > 0 ? 100 : 0;

    const userGrowth = previousPeriodUsers.length > 0 
      ? (((recentUsers.length - previousPeriodUsers.length) / previousPeriodUsers.length) * 100).toFixed(1)
      : recentUsers.length > 0 ? 100 : 0;

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Overview report retrieved successfully",
      data: {
        totals: {
          tests: totalTests,
          users: totalUsers,
          customers: totalCustomers,
          staff: totalStaff,
          managers: totalManagers,
          admins: totalAdmins,
          activeUsers: activeUsers,
          inactiveUsers: inactiveUsers
        },
        monthly: {
          tests: monthlyTests,
          users: monthlyUsers,
          customers: monthlyCustomers
        },
        testMethods: {
          popular: popularTestMethods,
          total: Object.keys(testMethodStats).length
        },
        recentActivity: {
          tests: recentTests.length,
          users: recentUsers.length,
          testGrowth: parseFloat(testGrowth),
          userGrowth: parseFloat(userGrowth),
          newUsers: newUsers
        },
        userBreakdown: {
          customers: {
            count: totalCustomers,
            percentage: totalUsers > 0 ? ((totalCustomers / totalUsers) * 100).toFixed(1) : 0
          },
          staff: {
            count: totalStaff,
            percentage: totalUsers > 0 ? ((totalStaff / totalUsers) * 100).toFixed(1) : 0
          },
          managers: {
            count: totalManagers,
            percentage: totalUsers > 0 ? ((totalManagers / totalUsers) * 100).toFixed(1) : 0
          },
          admins: {
            count: totalAdmins,
            percentage: totalUsers > 0 ? ((totalAdmins / totalUsers) * 100).toFixed(1) : 0
          },
          active: {
            count: activeUsers,
            percentage: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0
          },
          inactive: {
            count: inactiveUsers,
            percentage: totalUsers > 0 ? ((inactiveUsers / totalUsers) * 100).toFixed(1) : 0
          }
        }
      }
    });

  } catch (error) {
    console.error("Error fetching overview report:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve overview report",
      error: error.message
    });
  }
};

module.exports = {
  getOverviewReports
};
