const { dataConnect } = require("../../config/firebase.js");
const { calculateDateRange, groupByDate } = require("./reportUtils.js");

const getDashboardReports = async (req, res) => {
  try {
    const { 
      timeFilter = '30days',
      startDate,
      endDate
    } = req.body;

    if (timeFilter && !['7days', '30days', '3months', '6months', '1year'].includes(timeFilter)) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Invalid timeFilter. Must be one of: 7days, 30days, 3months, 6months, 1year"
      });
    }

    if (startDate && !endDate) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "endDate is required when startDate is provided"
      });
    }

    if (endDate && !startDate) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "startDate is required when endDate is provided"
      });
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime())) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Invalid startDate format. Use YYYY-MM-DD"
        });
      }

      if (isNaN(end.getTime())) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Invalid endDate format. Use YYYY-MM-DD"
        });
      }

      if (start > end) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "startDate cannot be later than endDate"
        });
      }

      const maxDateRange = 365 * 24 * 60 * 60 * 1000;
      if (end - start > maxDateRange) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Date range cannot exceed 1 year"
        });
      }
    }

    const dateRange = calculateDateRange(timeFilter, startDate, endDate);
    
    const DASHBOARD_QUERY = `
      query GetDashboardReport($startDate: Timestamp!, $endDate: Timestamp!) @auth(level: USER) {
        payments(where: {createdAt: {gt: $startDate, lt: $endDate}, status: {eq: "SUCCESS"}}) {
          id
          amount
          status
          createdAt
          updatedAt
        }
        
        testResults(where: {createdAt: {gt: $startDate, lt: $endDate}}) {
          id
          createdAt
          updatedAt
        }

        bookings(where: {createdAt: {gt: $startDate, lt: $endDate}, bookingHistories_on_booking:{exist: {status: {eq: "BOOKED"}}}}) {
          id
          staff {
            id
            user {
              fullname
            }
          }
          service {
            id
            title
          }
          bookingHistories_on_booking (orderBy: {createdAt: DESC}) {
                  id
                  status
          }
          createdAt
        }
        
        users (where: {createdAt: {gt: $startDate, lt: $endDate}}) {
          roleId
          id
          accountStatus
          createdAt
        }
      }
    `;

    const response = await dataConnect.executeGraphql(DASHBOARD_QUERY, {
      variables: dateRange
    });

    const { payments, testResults, users, bookings } = response.data;

    const totalProfits = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalTests = testResults.length;
    const totalUsers = users.length;
    const totalBookings = bookings.length;
    const totalCustomers = users.filter(user => user.roleId === "0").length;
    const totalStaff = users.filter(user => user.roleId === "1").length;
    const totalManagers = users.filter(user => user.roleId === "2").length;
    const totalAdmins = users.filter(user => user.roleId === "3").length;
    const activeUsers = users.filter(user => user.accountStatus === "active").length;
    const inactiveUsers = users.filter(user => user.accountStatus === "inactive").length;

    const dailyProfits = groupByDate(payments, 'amount');
    const dailyTests = groupByDate(testResults);
    const dailyBookings = groupByDate(bookings);
    
    const customerUsers = users.filter(user => user.roleId === "0");
    const dailyCustomerRegistrations = groupByDate(customerUsers);

    const serviceStats = {};
    bookings.forEach(booking => {
      if (booking.service) {
        const serviceName = booking.service.title || 'Unknown Service';
        serviceStats[serviceName] = (serviceStats[serviceName] || 0) + 1;
      }
    });

    const popularServices = Object.entries(serviceStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const bookingStatusStats = {
      EXPIRED: 0,
      CANCELLED: 0,
      COMPLETE: 0,
      PENDING: 0,
      REFUNDED: 0
    };

    const staffPerformance = {};

    bookings.forEach(booking => {
      const latestStatus = booking.bookingHistories_on_booking?.[0]?.status || 'PENDING';
      
      if (['EXPIRED', 'CANCELLED', 'COMPLETE', 'REFUNDED'].includes(latestStatus)) {
        bookingStatusStats[latestStatus]++;
      } else {
        bookingStatusStats.PENDING++;
      }

      if (booking.staff?.user?.fullname) {
        const staffName = booking.staff.user.fullname;
        if (!staffPerformance[staffName]) {
          staffPerformance[staffName] = {
            name: staffName,
            total: 0,
            completed: 0,
            cancelled: 0,
            expired: 0,
            pending: 0,
            refunded: 0
          };
        }
        staffPerformance[staffName].total++;
        
        if (latestStatus === 'COMPLETE') {
          staffPerformance[staffName].completed++;
        } else if (latestStatus === 'CANCELLED') {
          staffPerformance[staffName].cancelled++;
        } else if (latestStatus === 'EXPIRED') {
          staffPerformance[staffName].expired++;
        } else if (latestStatus === 'REFUNDED') {
          staffPerformance[staffName].refunded++;
        } else {
          staffPerformance[staffName].pending++;
        }
      }
    });

    const staffPerformanceArray = Object.values(staffPerformance).map(staff => ({
      ...staff,
      completionRate: staff.total > 0 ? ((staff.completed / staff.total) * 100).toFixed(1) : 0
    })).sort((a, b) => b.completionRate - a.completionRate);

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Dashboard report retrieved successfully",
      data: {
        profits: {
          total: totalProfits,
          daily: dailyProfits
        },
        tests: {
          total: totalTests,
          daily: dailyTests
        },
        bookings: {
          total: totalBookings,
          daily: dailyBookings,
          popularServices: popularServices,
          statusBreakdown: bookingStatusStats,
          staffPerformance: staffPerformanceArray
        },
        users: {
          total: totalUsers,
          customers: totalCustomers,
          staff: totalStaff,
          managers: totalManagers,
          admins: totalAdmins,
          active: activeUsers,
          inactive: inactiveUsers,
          dailyCustomerRegistrations: dailyCustomerRegistrations,
          breakdown: {
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
        },
        timeFilter,
        dateRange
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard report:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve dashboard report",
      error: error.message
    });
  }
};

module.exports = {
  getDashboardReports
};