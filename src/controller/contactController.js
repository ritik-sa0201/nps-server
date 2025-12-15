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
    let { phone, email, address } = req.body;

    // Ensure phone is an array
    if (typeof phone === "string") {
      phone = [phone]; // convert single string to array
    }

    if (!Array.isArray(phone) || phone.length === 0) {
      return res.status(400).json({ message: "Phone number must be a non-empty array" });
    }

    if (!email || !address) {
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
