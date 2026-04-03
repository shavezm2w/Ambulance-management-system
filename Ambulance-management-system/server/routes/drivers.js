import { Router } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/drivers
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
      whereConditions += " AND driver.name LIKE ?";
      params.push(`%${name}%`);
    }

    if (status !== "all") {
      if (status === "available") {
        whereConditions += " AND driver_logs.driver_status = '1'";
      } else {
        whereConditions += " AND driver_logs.driver_status != '1'";
      }
    }

    const baseQuery = `
      FROM driver
      LEFT JOIN driver_logs ON driver_logs.driver_id = driver.id
      ${whereConditions}`;

    const [countRows] = await pool.execute(`SELECT COUNT(*) as total ${baseQuery}`, params);
    const totalCount = countRows[0].total;
    const totalPages = Math.ceil(totalCount / rowsPerPage);

    const [rows] = await pool.execute(
      `SELECT driver.id, driver.name, driver_logs.driver_status, driver.age, driver.gender,
              driver.contact_number, driver.license_number,
              CONCAT(driver.address_line1, ', ', driver.address_line2, ', ', driver.city, ', ', driver.state) as address
       ${baseQuery}
       ORDER BY driver_logs.driver_status DESC
       LIMIT ${offset}, ${rowsPerPage}`,
      params
    );

    if (rows.length > 0) {
      return res.json({ totalPages, status: "success", message: "Data found", data: rows });
    } else {
      return res.json({ status: "error", message: "No records found or query failed" });
    }
  } catch (error) {
    console.error("Get drivers error:", error);
    return res.json({ status: "error", message: "Server error" });
  }
});

// POST /api/drivers (add new)
router.post("/", async (req, res) => {
  try {
    const { name, age, gender, contact_number, license_number, address_line1, address_line2, city, state, pin_code } = req.body;

    if (!name) {
      return res.json({ status: "error", message: "Missing required parameters" });
    }

    const [result] = await pool.execute(
      `INSERT INTO driver (name, age, gender, contact_number, license_number, address_line1, address_line2, city, state, pin_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, age, gender, contact_number, license_number, address_line1, address_line2, city, state, pin_code]
    );

    if (result.affectedRows > 0) {
      return res.json({ status: "Success", message: "Record Inserted" });
    } else {
      return res.json({ status: "Error", message: "Insert failed" });
    }
  } catch (error) {
    console.error("Add driver error:", error);
    return res.json({ status: "Error", message: error.message });
  }
});

// PUT /api/drivers (update)
router.put("/", async (req, res) => {
  try {
    const { id, name, age, gender, contact_number, license_number, address_line1, address_line2, city, state, pin_code } = req.body;

    if (!id) {
      return res.json({ status: "error", message: "Missing required parameters" });
    }

    const [result] = await pool.execute(
      `UPDATE driver SET name = ?, age = ?, gender = ?, contact_number = ?, license_number = ?,
              address_line1 = ?, address_line2 = ?, city = ?, state = ?, pin_code = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, age, gender, contact_number, license_number, address_line1, address_line2, city, state, pin_code, id]
    );

    if (result.affectedRows > 0) {
      return res.json({ status: "Success", message: "Record Inserted" });
    } else {
      return res.json({ status: "Error", message: "Update failed" });
    }
  } catch (error) {
    console.error("Update driver error:", error);
    return res.json({ status: "Error", message: error.message });
  }
});

// GET /api/drivers/:id
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.json({ status: "error", message: "Invalid ID format" });
    }

    const [rows] = await pool.execute(
      `SELECT id, name, age, gender, contact_number, license_number,
              address_line1, address_line2, city, state, pin_code
       FROM driver WHERE id = ?`,
      [id]
    );

    if (rows.length > 0) {
      return res.json({ status: "Success", message: "Data found", data: rows[0] });
    } else {
      return res.json({ status: "error", message: "No records found" });
    }
  } catch (error) {
    console.error("Get driver by id error:", error);
    return res.json({ status: "error", message: "Server error" });
  }
});

// DELETE /api/drivers/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const [result] = await pool.execute("DELETE FROM driver WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      return res.json({ status: "success", message: "Record deleted successfully" });
    } else {
      return res.json({ status: "failed", message: "Delete failed" });
    }
  } catch (error) {
    console.error("Delete driver error:", error);
    return res.json({ status: "failed", message: error.message });
  }
});

export default router;
