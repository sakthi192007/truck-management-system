const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const GroupMaster = db.GroupMaster;
const SubMaster = db.SubMaster;
const RolePermissions = db.RolePermissions;
const verifytoken = require('../../middlewares/verifytoken');

router.post('/insert', verifytoken, async (req, res) => {
  const t = await db.sequelize.transaction(); // always start before try
  try {
    const payload = req.body;
    console.log('🧾 GroupMaster insert payload:', JSON.stringify(payload, null, 2));

    const newGM = await db.GroupMaster.create({
      GM_GroupName: payload.GM_GroupName,
      GM_Role: payload.GM_Role,
      GM_Description: payload.GM_Description,
    //   GM_ModifiedOn: new Date(), // proper datetime object
      GM_Accessstatus1: 1,
      GM_Accessstatus2: 0,
      GM_Accessstatus3: 0,
      GM_Accessstatus4: 0
    }, { transaction: t });

    const GM_PK = newGM.GM_PK;
    console.log("Inserted GroupMaster with GM_PK:", GM_PK);

    const permissionsData = (payload.Permissions || []).map(p => ({
      GM_PK: GM_PK,
      Menukey: p.Menukey,
      CanMenu: p.CanMenu ? 1 : 0,
      CanCreate: p.CanCreate ? 1 : 0,
      CanEdit: p.CanEdit ? 1 : 0,
      CanView: p.CanView ? 1 : 0,
      CanDelete: p.CanDelete ? 1 : 0,
      CanReport: p.CanReport ? 1 : 0
    }));

    if (permissionsData.length > 0) {
      await db.RolePermissions.bulkCreate(permissionsData, { transaction: t });
      console.log(` Inserted ${permissionsData.length} RolePermission records`);
    }

    await t.commit();
    console.log(' Transaction committed successfully');

    return res.status(201).json({
      response_code: '201',
      message: 'Inserted successfully',
      data: { GM_PK }
    });

  } catch (err) {
    console.error(' Error inserting GroupMaster:', err.message);

    
    if (!t.finished) {
      try {
        await t.rollback();
        console.log(' Transaction rolled back due to error');
      } catch (rollbackErr) {
        console.error(' Rollback failed:', rollbackErr.message);
      }
    }

    return res.status(500).json({
      message: 'Insert failed',
      error: err.message
    });
  }
});
router.get('/',verifytoken, async function (req, res) {
  try {
    const { Op } = db.Sequelize;
    const data = await GroupMaster.findAll({
          attributes: {
            include: [
              [db.Sequelize.literal("CONVERT(VARCHAR, GM_CreatedOn, 105)"), 'GM_CreatedOn']
            ]
          },
      //       where: {
      // GM_Role: { [Op.ne]: 0 },
      // },
          order: [['GM_PK', 'ASC']],
          raw: true
        });
    res.status(200).send({
      response_code: "200",
      response_message: "success.",
      data,
    });
    winston.info("GroupMaster");
  } catch (error) {
    console.error("Error fetching GroupMaster details:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});
// router.get('/', verifytoken, async (req, res) => {
//     try {
//         const data = await GroupMaster.findAll({
//             order: [['GM_PK', 'ASC']],
//             raw: true
//         });
//         res.status(200).send({
//             response_code: "200",
//             response_message: "success.",
//             data,
//         });
//     } catch (err) {
//         winston.error(err);
//         res.status(500).send({ response_code: "500", response_message: "Internal Server Error" });
//     }
// });
router.get('/:id', verifytoken, async (req, res) => {
    try {
        const id = req.params.id;
        const group = await GroupMaster.findByPk(id);
        if (!group) return res.status(404).send({ response_code: "404", response_message: "GroupMaster not found" });

const permissions = await RolePermissions.findAll({ where: { GM_PK: id }, raw: true });

        res.status(200).send({ response_code: "200", GroupMaster: group, Permissions: permissions});
    } catch (err) {
        console.error(err);
        res.status(500).send({ response_code: "500", response_message: "Internal Server Error" });
    }
});
router.put('/:id', verifytoken, async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const id = +req.params.id; // ensure number
    const payload = req.body;
    console.log('Updating GroupMaster ID:', id, 'Payload:', payload);

    // Find GroupMaster
    const gm = await GroupMaster.findByPk(id, { transaction: t });
    if (!gm) {
      await t.rollback();
      return res.status(404).send({ response_code: "404", response_message: "GroupMaster not found" });
    }

    // Update GroupMaster fields
    await gm.update({
      GM_GroupName: payload.GM_GroupName,
      GM_Role: payload.GM_Role,
      GM_Description: payload.GM_Description
    }, { transaction: t });

    // Delete old RolePermissions
    const deleted = await RolePermissions.destroy({ where: { GM_PK: id }, transaction: t });
    console.log('Deleted old permissions:', deleted);

    // Insert new permissions
    const perms = (payload.Permissions || []).map(p => ({
      GM_PK: id,
      Menukey: +p.Menukey,
      CanMenu: +p.CanMenu,
      CanCreate: +p.CanCreate,
      CanEdit: +p.CanEdit,
      CanView: +p.CanView,
      CanDelete: +p.CanDelete,
      CanReport: +p.CanReport
    }));

    if (perms.length) {
      const inserted = await RolePermissions.bulkCreate(perms, { transaction: t, validate: true });
      console.log('Inserted permissions:', inserted.length);
    }

    await t.commit();
    res.status(200).send({ response_code: "200", response_message: "GroupMaster updated successfully" });

  } catch (err) {
    await t.rollback();
    console.error('Update error:', err);
    res.status(500).send({ response_code: "500", response_message: "Internal Server Error", error: err.message });
  }
});
router.delete('/:id', verifytoken, async (req, res) => {
    try {
        const id = req.params.id;
        await RolePermissions.destroy({ where: { GM_PK: id } });
        // await SubMaster.destroy({ where: { SM_GroupId: id } });
        const deleted = await GroupMaster.destroy({ where: { GM_PK: id } });

        if (!deleted) return res.status(404).send({ response_code: "404", response_message: "GroupMaster not found" });
        res.status(200).send({ response_code: "200", response_message: "Deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ response_code: "500", response_message: "Internal Server Error" });
    }
});
module.exports = router;