import { Router } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/trips
router.get("/", async (req, res) => {
  try {
    const rowsPerPage = 8;
    const currentPage = parseInt(req.query.currentpage) || 1;
    const offset = (currentPage - 1) * rowsPerPage;
    const status = req.query.status || "all";
    const name = req.query.name || "";

    let whereConditions = "WHERE 1";
    const params = [];

    if (name) {
      whereConditions += " AND (a.registration_number LIKE ? OR d.name LIKE ? OR h.hospital_name LIKE ?)";
      const searchPattern = `%${name}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (status !== "all") {
      if (status === "completed") {
        whereConditions += " AND t.trip_end <= NOW()";
      } else {
        whereConditions += " AND t.trip_end >= NOW()";
      }
    }

    const baseQuery = `
      FROM ambulance a
      JOIN trip t ON t.ambulance_id = a.id
      JOIN driver d ON t.driver_id = d.id
      JOIN hospital h ON h.id = t.hospital_id
      ${whereConditions}`;

    const [countRows] = await pool.execute(`SELECT COUNT(*) as total ${baseQuery}`, params);
    const totalCount = countRows[0].total;
    const totalPages = Math.ceil(totalCount / rowsPerPage);

    const [rows] = await pool.execute(
      `SELECT t.id, a.registration_number, d.name AS driver_name, h.hospital_name,
              t.trip_start, t.trip_end, t.distance_covered_km
       ${baseQuery}
       ORDER BY t.trip_end DESC
       LIMIT ${offset}, ${rowsPerPage}`,
      params
    );

    if (rows.length > 0) {
      return res.json({ totalPages, status: "success", message: "Data found", data: rows });
    } else {
      return res.json({ status: "error", message: "No records found or query failed" });
    }
  } catch (error) {
    console.error("Get trips error:", error);
    return res.json({ status: "error", message: "Server error" });
  }
});

export default router;
