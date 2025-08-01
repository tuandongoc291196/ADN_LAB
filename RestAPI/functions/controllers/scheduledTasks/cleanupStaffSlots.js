const { restStaffSlotByPosition } = require("../staffs/staffUtils.js");

const cleanupStaffSlots = async () => {
  try {
    console.log("Starting weekly staff slot reset for position 1...");
    const result = await restStaffSlotByPosition("1");
    console.log("Weekly staff slot reset completed successfully", result);
  } catch (error) {
    console.error("Error in weekly staff slot reset:", error);
  }
};

module.exports = {
  cleanupStaffSlots
};
