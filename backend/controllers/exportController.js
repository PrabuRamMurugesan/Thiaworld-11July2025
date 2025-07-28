const ExcelJS = require("exceljs");
const SecurePlan = require("../models/securePlanModel");

const exportToExcel = async (req, res) => {
  try {
    const plans = await SecurePlan.find();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Secure Plan Leads");

    sheet.columns = [
      { header: "Name", key: "name" },
      { header: "Mobile", key: "mobile" },
      { header: "Email", key: "email" },
      { header: "Plan", key: "preferredPlan" },
      { header: "Principal", key: "totalPrice" },
      { header: "Down Payment", key: "downPayment" },
      { header: "Tenure", key: "tenureMonths" },
      { header: "Interest", key: "interestRate" },
      { header: "Monthly EMI", key: "monthlyInstallment" },
      { header: "Total Payable", key: "totalPayable" },
      { header: "Created At", key: "createdAt" },
    ];

    plans.forEach((p) => {
      sheet.addRow(p);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=secure_plan_leads.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: "Export failed" });
  }
};

module.exports = { exportToExcel };
