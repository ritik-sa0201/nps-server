import Contact from "../mongoDb/models/contact-model.js";


export const getContactInfo = async (req, res) => {
  try {
    const contact = await Contact.findOne();

    if (!contact) {
      return res.status(404).json({ message: "Contact info not found" });
    }

    res.status(200).json({ contact });
  } catch (error) {
    console.error("Get Contact Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateContactInfo = async (req, res) => {
  try {
    const { phone, email, address } = req.body;

    if (!phone || !email || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let contact = await Contact.findOne();

    if (!contact) {
      contact = new Contact({ phone, email, address });
    } else {
      contact.phone = phone;
      contact.email = email;
      contact.address = address;
    }

    await contact.save();

    res.status(200).json({
      message: "Contact information updated successfully",
      contact,
    });
  } catch (error) {
    console.error("Update Contact Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
