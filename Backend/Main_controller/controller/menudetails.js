const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const sequelize = db.sequelize;
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const MenuDetails = db.MenuDetails;
const verifytoken = require('../../middlewares/verifytoken');
const { Op } = require('sequelize');
// POST: Create new MenuDetails
router.post('/parentmenu/post', verifytoken, async function (req, res) {
  try {
    const jsondata = req.body;
    const existing = await MenuDetails.findOne({ where: { Menuname: jsondata.Menuname } });
    if (existing) {
      const response = CF.getStandardResponse(400, "This MenuDetails already exists.");
      return res.status(400).send(response);
    }
    jsondata.Menutype = 0;
    await MenuDetails.create(jsondata);

    const response = CF.getStandardResponse(201, "MenuDetails created successfully.");
    return res.status(201).send(response);

  } catch (err) {
    winston.error('Error: ' + err);
    const response = CF.getStandardResponse(500, "Something went wrong.");
    return res.status(500).send(response);
  }
});


// PUT: Update MenuDetails by ID
router.put('/parentmenu/:id', verifytoken, async function (req, res) {
  try {
    const modifiedon = CF.getCurrentSQLDateTime();
    console.log(modifiedon);
    const data = await MenuDetails.findByPk(req.params.id);
    if (!data) {
      const response = CF.getStandardResponse(404, "MenuDetails not found.");
      return res.status(404).send(response);
    }

    const updatedData = {
      ...req.body,
      Menutype: 0,
      Modifiedon: db.Sequelize.literal(`CAST('${modifiedon}' AS DATETIME)`)
    };

    await data.update(updatedData);
    const response = CF.getStandardResponse(200, "MenuDetails updated successfully.");
    return res.status(200).send(response);

  } catch (err) {
    winston.error('Error: ' + err);
    const response = CF.getStandardResponse(500, "Failed to update MenuDetails.");
    return res.status(500).send(response);
  }
});

// Getall MenuDetails
router.get("/parentmenu/getall", verifytoken, async function (req, res) {
  try {
    const data = await MenuDetails.findAll({
      attributes: ['Menukey', 'Menutype', 'Menudescription', 'Menuname', 'Menuicon', 'Menulist',
        [db.Sequelize.literal("CONVERT(VARCHAR, Createdon, 105)"), 'Createdon']
      ],
      where: { Menutype: 0 },
      order: [['Menukey', 'ASC']],
      raw: true
    });

    res.status(200).send({
      response_code: "200",
      response_message: "success.",
      data,
    });

    winston.info("Fetched MenuDetails successfully.");
  } catch (error) {
    console.error("Error fetching MenuDetails details:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});


// Get a MenuDetails by ID
router.get('/parentmenu/:id', verifytoken, async function (req, res) {
  const id = req.params.id;

  try {
    const data = await MenuDetails.findOne({
      where: { Menukey: id }
    });
    if (!data) {
      return res.status(404).send({
        response_code: "404",
        response_message: "MenuDetails record not found."
      });
    }

    res.status(200).send({
      response_code: "200",
      response_message: "success.",
      data
    });

    winston.info("MenuDetailsgetparticularid");
  } catch (error) {
    console.error("Error fetching MenuDetails details:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});

// Delete a MenuDetails by ID
router.delete('/parentmenu/:id', verifytoken, async function (req, res) {
  try {
    const id = parseInt(req.params.id);
    const deletedCount = await MenuDetails.destroy({
      where: { Menukey: id }
    });

    if (deletedCount === 0) {
      const response = CF.getStandardResponse(404, "MenuDetails not found.");
      return res.status(404).send(response);
    }

    winston.info(`MenuDetails deleted with id: ${id}`);
    const response = CF.getStandardResponse(200, "MenuDetails deleted successfully.");
    return res.status(200).send(response);

  } catch (error) {
    winston.error('Error deleting MenuDetails:', error);
    const response = CF.getStandardResponse(500, "Internal server error.");
    return res.status(500).send(response);
  }
});

// Create Submenu
router.post('/submenu/post', verifytoken, async function (req, res) {
  try {
    const jsondata = req.body;
    const Parentid = jsondata.Parentmenuid;
    let parentMenu = null;
    if (Parentid && Parentid != 0) {
      parentMenu = await MenuDetails.findOne({ where: { Menukey: Parentid } });

      if (!parentMenu) {
        const response = CF.getStandardResponse(400, "Parent menu not found.");
        return res.status(400).send(response);
      }
      jsondata.Parentmenuid = parentMenu.Menukey;
    } else {
      jsondata.Parentmenuid = null;
    }

    const existing = await MenuDetails.findOne({ where: { Menuname: jsondata.Menuname } });
    if (existing) {
      const response = CF.getStandardResponse(400, "This SubMenuDetails already exists.");
      return res.status(400).send(response);
    }

    jsondata.Menutype = 1;

    await MenuDetails.create(jsondata);
    winston.info('Submenu created successfully.');

    const response = CF.getStandardResponse(201, "SubMenuDetails created successfully.");
    return res.status(201).send(response);

  } catch (err) {
    winston.error('Error creating submenu:', err);
    const response = CF.getStandardResponse(500, "Something went wrong.");
    return res.status(500).send(response);
  }
});



router.put('/submenu/:id', verifytoken, async function (req, res) {
  try {
    const modifiedon = CF.getCurrentSQLDateTime();

    const data = await MenuDetails.findByPk(req.params.id);
    if (!data) {
      const response = CF.getStandardResponse(404, "SubMenuDetails not found.");
      return res.status(404).send(response);
    }
    const updatedData = {
      ...req.body,
      Menutype: 1,
      Modifiedon: db.Sequelize.literal(`CAST('${modifiedon}' AS DATETIME)`)
    };

    await data.update(updatedData);

    const response = CF.getStandardResponse(200, "SubMenuDetails updated successfully.");
    return res.status(200).send(response);

  } catch (err) {
    winston.error('Error updating submenu:', err);
    const response = CF.getStandardResponse(500, "Failed to update SubMenuDetails.");
    return res.status(500).send(response);
  }
});


// Load dropdown for parentmenu 
router.get("/submenu/loaddropdown", verifytoken, async function (req, res) {
  try {
    const data = await MenuDetails.findAll({
      attributes: ['Menuname', 'Menukey'],
      where: { Parentmenuid: null },
      order: [['Menukey', 'ASC']],
      raw: true
    });
    console.log(data);
    res.status(200).send({
      response_code: "200", response_message: "Success", data,
    });

    winston.info("Loaded submenu dropdown successfully");
  } catch (error) {
    winston.error("Error fetching SubMenuDetails:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});

// Getall SubMenuDetails
router.get("/submenu/getall", verifytoken, async function (req, res) {
  try {
    const data = await MenuDetails.findAll({
      attributes: {
        include: [
          [db.Sequelize.literal("CONVERT(VARCHAR, Createdon, 105)"), 'Createdon']
        ]
      }, where: { Menutype: 1 },
      order: [['Menukey', 'ASC']],
      raw: true
    });
    res.status(200).send({
      response_code: "200",
      response_message: "success.",
      data,
    });
    winston.info("SubMenuDetails");
  } catch (error) {
    console.error("Error fetching SubMenuDetails details:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});

// Get a SubMenuDetails by ID

router.get('/submenu/:id', verifytoken, async function (req, res) {
  const id = req.params.id;

  try {
    const data = await MenuDetails.findOne({
      where: { Menukey: id }
    });
    if (!data) {
      return res.status(404).send({
        response_code: "404",
        response_message: "SubMenuDetails record not found."
      });
    }

    res.status(200).send({
      response_code: "200",
      response_message: "success.",
      data
    });

    winston.info("SubMenuDetailsgetparticularid");
  } catch (error) {
    console.error("Error fetching SubMenuDetails details:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});

// Delete a SubMenuDetails by ID
router.delete('/submenu/:id', verifytoken, async function (req, res) {
  try {
    const id = parseInt(req.params.id);

    const deletedCount = await MenuDetails.destroy({
      where: { Menukey: id }
    });

    if (deletedCount === 0) {
      const response = CF.getStandardResponse(404, "SubMenuDetails not found.");
      return res.status(404).send(response);
    }

    winston.info("SubMenuDetails deleted with id: " + id);
    const response = CF.getStandardResponse(200, "SubMenuDetails deleted successfully.");
    return res.status(200).send(response);

  } catch (error) {
    winston.error('Error deleting SubMenuDetails:', error);
    const response = CF.getStandardResponse(500, "Internal server error.");
    return res.status(500).send(response);
  }
});


// Create childmenu
router.post('/childmenu/post', verifytoken, async function (req, res) {
  try {
    const jsondata = req.body;
    const subParentid = jsondata.SubParentid;
console.log(subParentid);
    let subparentMenu = null;
    if (subParentid && subParentid != 0) {
      subparentMenu = await MenuDetails.findOne({ where: { Menukey: subParentid } });

      if (!subparentMenu) {
        const response = CF.getStandardResponse(400, "Parent menu not found.");
        return res.status(400).send(response);
      }
console.log(subparentMenu.Menukey);
      jsondata.SubParentid = subparentMenu.Menukey;
    } else {
      jsondata.SubParentid = null;
    }

   
    jsondata.Menutype = 2;

    await MenuDetails.create(jsondata);
    winston.info('childmenu created successfully.');

    const response = CF.getStandardResponse(201, "childmenuDetails created successfully.");
    return res.status(201).send(response);

  } catch (err) {
    winston.error('Error creating childmenu:', err);
    const response = CF.getStandardResponse(500, "Something went wrong.");
    return res.status(500).send(response);
  }
});



router.put('/childmenu/:id', verifytoken, async function (req, res) {
  try {
    const modifiedon = CF.getCurrentSQLDateTime();

    const data = await MenuDetails.findByPk(req.params.id);
    if (!data) {
      const response = CF.getStandardResponse(404, "childmenuDetails not found.");
      return res.status(404).send(response);
    }
    const updatedData = {
      ...req.body,
      Menutype: 2,
      Modifiedon: db.Sequelize.literal(`CAST('${modifiedon}' AS DATETIME)`)
    };

    await data.update(updatedData);

    const response = CF.getStandardResponse(200, "childmenuDetails updated successfully.");
    return res.status(200).send(response);

  } catch (err) {
    winston.error('Error updating childmenu:', err);
    const response = CF.getStandardResponse(500, "Failed to update childmenuDetails.");
    return res.status(500).send(response);
  }
});


// Load dropdown for subparentmenu 
router.get("/childmenu/loaddropdown/:id",verifytoken, async function (req, res) {
  try {
    const id=req.params.id;
    const data = await MenuDetails.findAll({
      attributes: ['Menuname', 'Menukey'],
      where: {
        SubParentid: null,           
        Parentmenuid: id 
      },
      order: [['Menukey', 'ASC']],
      raw: true
    });
    console.log(data);
    res.status(200).send({
      response_code: "200", response_message: "Success", data,
    });

    winston.info("Loaded subparentmenu dropdown successfully");
  } catch (error) {
    winston.error("Error fetching childmenu details:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});

// Getall childMenuDetails
router.get("/childmenu/getall", verifytoken, async function (req, res) {
  try {
    const data = await MenuDetails.findAll({
      attributes: {
        include: [
          [db.Sequelize.literal("CONVERT(VARCHAR, Createdon, 105)"), 'Createdon']
        ]
      }, where: { Menutype: 2 },
      order: [['Menukey', 'ASC']],
      raw: true
    });
    res.status(200).send({
      response_code: "200",
      response_message: "success.",
      data,
    });
    winston.info("ChildMenuDetails");
  } catch (error) {
    console.error("Error fetching childmenuDetails details:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});

// Get a ChildMenuDetails by ID
router.get('/childmenu/:id', verifytoken, async function (req, res) {
  const id = req.params.id;
  try {
    const data = await MenuDetails.findOne({
      where: { Menukey: id }
    });
    if (!data) {
      return res.status(404).send({
        response_code: "404",
        response_message: "childmenuDetails record not found."
      });
    }

    res.status(200).send({
      response_code: "200",
      response_message: "success.",
      data
    });

    winston.info("childmenuDetailsgetparticularid");
  } catch (error) {
    console.error("Error fetching childmenuDetails details:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});

// Delete a ChildMenuDetails by ID
router.delete('/childmenu/:id', verifytoken, async function (req, res) {
  try {
    const id = parseInt(req.params.id);

    const deletedCount = await MenuDetails.destroy({
      where: { Menukey: id }
    });

    if (deletedCount === 0) {
      const response = CF.getStandardResponse(404, "childmenuDetails not found.");
      return res.status(404).send(response);
    }

    winston.info("childmenuDetails deleted with id: " + id);
    const response = CF.getStandardResponse(200, "childmenuDetails deleted successfully.");
    return res.status(200).send(response);

  } catch (error) {
    winston.error('Error deleting childmenuDetails:', error);
    const response = CF.getStandardResponse(500, "Internal server error.");
    return res.status(500).send(response);
  }
});

//load menu for groupmaster//
router.get('/loadmenuname', verifytoken, async function (req, res) {
  try {
    const data = await MenuDetails.findAll({
      attributes: ['Menuname', 'Menukey'],
      order: [['Menukey', 'ASC']],
      raw: true
    });
    console.log(data);
    res.status(200).send({
      response_code: "200", response_message: "Success", data,
    });

    winston.info("Loaded menu dropdown successfully");
  } catch (error) {
    winston.error("Error fetching MenuDetails:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});
module.exports = router;