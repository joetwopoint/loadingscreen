Staff Avatars

Place your staff character images in this folder and reference them in html/script.js.

Example:
  html/staff/alex.png
  html/staff/sam.jpg

In html/script.js, set:

  const STAFF_ENABLED = true;

  const staffMembers = [
    {
      name: "Alex",
      role: "Owner",
      description: "Main contact for server issues.",
      image: "staff/alex.png"
    },
    {
      name: "Sam",
      role: "Staff Lead",
      description: "Handles staff apps & reports.",
      image: "staff/sam.jpg"
    }
  ];

Images are loaded relative to the html folder, so use paths like 'staff/alex.png'.
