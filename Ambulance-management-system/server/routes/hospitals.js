import { Router } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/hospitals
router.get("/", async (req, res) => {
  try {
    const rowsPerPage = 8;
    const currentPage = parseInt(req.query.currentpage) || 1;
    const offset = (currentPage - 1) * rowsPerPage;
    const name = req.query.name || "";

    let whereCondition = "";
    const params = [];

    if (name) {
      whereCondition = "WHERE h.hospital_name LIKE ?";
      params.push(`%${name}%`);
    }

    const baseQuery = `FROM hospital h ${whereCondition}`;

    const [countRows] = await pool.execute(`SELECT COUNT(*) as total ${baseQuery}`, params);
    const totalCount = countRows[0].total;
    const totalPages = Math.ceil(totalCount / rowsPerPage);

    const [rows] = await pool.execute(
      `SELECT h.id, h.hospital_name, h.contact_number, h.email_address,
              CONCAT(h.address_line1, ' ', h.address_line2, ', ', h.city, ', ', h.state) AS address
       ${baseQuery}
       LIMIT ${offset}, ${rowsPerPage}`,
      params
    );

    if (rows.length > 0) {
      return res.json({ totalPages, status: "success", message: "Data found", data: rows });
    } else {
      return res.json({ status: "error", message: "No records found or query failed" });
    }
  } catch (error) {
    console.error("Get hospitals error:", error);
    return res.json({ status: "error", message: "Server error" });
  }
});

export default router;
