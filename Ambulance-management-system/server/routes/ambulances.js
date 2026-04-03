import { Router } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/ambulances
router.get("/", async (req, res) => {
  try {
    const rowsPerPage = 6;
    const currentPage = parseInt(req.query.currentpage) || 1;
    const offset = (currentPage - 1) * rowsPerPage;
    const status = req.query.status || "all";
    const name = req.query.name || "";

    let whereCondition = "WHERE 1";
    const params = [];

    if (name) {
      whereCondition += " AND ambulance.registration_number LIKE ?";
      params.push(`%${name}%`);
    }

    if (status !== "all") {
      if (status === "available") {
        whereCondition += " AND ambulance_logs.ambulance_status = '1'";
      } else {
        whereCondition += " AND ambulance_logs.ambulance_status != '1'";
      }
    }

    const baseQuery = `
      FROM ambulance
      LEFT JOIN ambulance_logs ON ambulance_logs.ambulance_id = ambulance.id
      ${whereCondition}`;

    const [countRows] = await pool.execute(`SELECT COUNT(*) as total ${baseQuery}`, params);
    const totalCount = countRows[0].total;
    const totalPages = Math.ceil(totalCount / rowsPerPage);

    const [rows] = await pool.execute(
      `SELECT ambulance.id, ambulance.registration_number, ambulance.ambulance_type, ambulance_logs.ambulance_status
       ${baseQuery}
       ORDER BY ambulance_logs.ambulance_status DESC
       LIMIT ${offset}, ${rowsPerPage}`,
      params
    );

    if (rows.length > 0) {
      return res.json({ totalPages, status: "Success", message: "Data found", data: rows });
    } else {
      return res.json({ status: "error", message: "No records found or query failed" });
    }
  } catch (error) {
    console.error("Get ambulances error:", error);
    return res.json({ status: "error", message: "Server error" });
  }
});

// POST /api/ambulances (add new)
router.post("/", async (req, res) => {
  try {
    const { name, ambulance_type } = req.body;

    if (!name) {
      return res.json({ status: "error", message: "Missing required parameters" });
    }

    const [result] = await pool.execute(
      "INSERT INTO ambulance (registration_number, ambulance_type) VALUES (?, ?)",
      [name, ambulance_type]
    );

    if (result.affectedRows > 0) {
      return res.json({ status: "Success", message: "Record Inserted" });
    } else {
      return res.json({ status: "Error", message: "Insert failed" });
    }
  } catch (error) {
    console.error("Add ambulance error:", error);
    return res.json({ status: "Error", message: error.message });
  }
});

// PUT /api/ambulances (update)
router.put("/", async (req, res) => {
  try {
    const { id, name, ambulance_type } = req.body;

    if (!name) {
      return res.json({ status: "error", message: "Missing required parameters" });
    }

    const [result] = await pool.execute(
      "UPDATE ambulance SET registration_number = ?, ambulance_type = ?, updated_at = NOW() WHERE id = ?",
      [name, ambulance_type, id]
    );

    if (result.affectedRows > 0) {
      return res.json({ status: "Success", message: "Record updated" });
    } else {
      return res.json({ status: "Error", message: "Update failed" });
    }
  } catch (error) {
    console.error("Update ambulance error:", error);
    return res.json({ status: "Error", message: error.message });
  }
});

// GET /api/ambulances/:id
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.json({ status: "error", message: "Invalid ID format" });
    }

    const [rows] = await pool.execute(
      "SELECT registration_number, ambulance_type FROM ambulance WHERE id = ?",
      [id]
    );

    if (rows.length > 0) {
      return res.json({ status: "Success", message: "Data found", data: rows[0] });
    } else {
      return res.json({ status: "error", message: "No records found" });
    }
  } catch (error) {
    console.error("Get ambulance by id error:", error);
    return res.json({ status: "error", message: "Server error" });
  }
});

// DELETE /api/ambulances/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const [result] = await pool.execute("DELETE FROM ambulance WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      return res.json({ status: "success", message: "Record deleted successfully" });
    } else {
      return res.json({ status: "failed", message: "Delete failed" });
    }
  } catch (error) {
    console.error("Delete ambulance error:", error);
    return res.json({ status: "failed", message: error.message });
  }
});

export default router;
