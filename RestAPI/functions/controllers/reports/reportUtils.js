const calculateDateRange = (timeFilter, startDate, endDate) => {
  const now = new Date();
  let start, end;

  if (startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
  } else {
    switch (timeFilter) {
      case '7days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '6months':
        start = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    end = now;
  }

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString()
  };
};

const groupByDate = (items, amountField = null) => {
  const grouped = {};
  
  items.forEach(item => {
    const date = new Date(item.createdAt).toISOString().split('T')[0];
    
    if (amountField) {
      grouped[date] = (grouped[date] || 0) + item[amountField];
    } else {
      grouped[date] = (grouped[date] || 0) + 1;
    }
  });

  return Object.entries(grouped).map(([date, value]) => ({ 
    date, 
    [amountField ? 'amount' : 'count']: value 
  }));
};

module.exports = {
  calculateDateRange,
  groupByDate
};
