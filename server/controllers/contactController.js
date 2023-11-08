const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModal");

//@desc Get all contacts
// @route GET /api/contacts
// @access Public

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json(contacts);
});

//@desc Create New contact
//@route POST /api/contacts
//@access Public
const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
  });

  res.status(201).json({ success: true, data: contact });
});

//@desc Get a specific contact by ID
// @route GET /api/contacts/:id
// @access Public

const getContactById = asyncHandler(async (req, res) => {
  const contactId = req.params.id;

  // Assuming you want to retrieve a contact by its ID from the database
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return res
      .status(404)
      .json({ error: `Contact with ID ${contactId} not found` });
  }

  res.status(200).json({ success: true, data: contact });
});

//@desc Update a specific contact by ID
// @route PUT /api/contacts/:id
// @access Public

const updateContactById = asyncHandler(async (req, res) => {
  const contactId = req.params.id;
  const { name, email, phone } = req.body;

  // Assuming you want to update a contact by its ID in the database
  let contact = await Contact.findById(contactId);

  if (!contact) {
    return res
      .status(404)
      .json({ error: `Contact with ID ${contactId} not found` });
  }

  // Update the contact properties if provided in the request
  if (name) {
    contact.name = name;
  }
  if (email) {
    contact.email = email;
  }
  if (phone) {
    contact.phone = phone;
  }

  // Save the updated contact in the database
  contact = await contact.save();

  res.status(200).json({ success: true, data: contact });
});

//@desc Delete a specific contact by ID
// @route DELETE /api/contacts/:id
// @access Public
const deleteContactById = asyncHandler(async (req, res) => {
  try {
    // Assuming you want to delete a contact by its ID in the database
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }

    // Delete the contact from the database using the deleteOne method
    await Contact.deleteOne({ _id: contact._id });

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  getContacts,
  createContact,
  getContactById,
  updateContactById,
  deleteContactById,
};
