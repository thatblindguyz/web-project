const express = require("express");
const ExcelJS = require("exceljs");

const Order = require("../models/order");

const { auth, isAdmin } = require("../middleware/auth");

const router = express.Router();

/* ============================
   EXPORT ORDERS EXCEL
============================ */

router.get(
  "/export-orders",

  auth,

  isAdmin,

  async (req, res) => {
    try {
      const orders = await Order.find().populate("userId", "name email").sort({
        createdAt: -1,
      });

      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("Orders");

      worksheet.columns = [
        {
          header: "Mã đơn",
          key: "_id",
          width: 25,
        },

        {
          header: "Khách hàng",
          key: "userId",
          width: 30,
        },

        {
          header: "Tạm tính",
          key: "subtotal",
          width: 15,
        },

        {
          header: "Tổng tiền",
          key: "total",
          width: 15,
        },

        {
          header: "Giao hàng",
          key: "delivery_status",
          width: 18,
        },

        {
          header: "Thanh toán",
          key: "payment_status",
          width: 18,
        },

        {
          header: "Ngày tạo",
          key: "createdAt",
          width: 25,
        },
      ];

      worksheet.getRow(1).font = {
        bold: true,
      };

      orders.forEach((order) => {
        worksheet.addRow({
          _id: order._id.toString(),

          userId: order.userId?.email || order.userId?.name || "N/A",

          subtotal: order.subtotal,

          total: order.total,

          delivery_status: order.delivery_status,

          payment_status: order.payment_status,

          createdAt: order.createdAt
            ? new Date(order.createdAt).toLocaleString("vi-VN")
            : "",
        });
      });

      res.setHeader(
        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      res.setHeader(
        "Content-Disposition",

        "attachment; filename=orders.xlsx",
      );

      await workbook.xlsx.write(res);

      res.end();
    } catch (err) {
      console.error("Export lỗi:", err);

      res.status(500).json({
        message: "Lỗi export Excel",
      });
    }
  },
);

module.exports = router;
