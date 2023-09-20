const { DB } = require("../DB");
const db = new DB();

function formatDateToMySQLDateTime(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

(async () => {
  await db.createTable(
    "content",
    `
      id INT PRIMARY KEY AUTO_INCREMENT,
      shareId INT NOT NULL,
      url TEXT NOT NULL,
      owner TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    `
  );

  await db.insert("content", {
    shareId: 1,
    url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    owner: "PSY",
    title: "Gangnam Style",
    description:
      "Gangnam Style is the 18th K-pop single by the South Korean musician Psy. The song was released on July 15, 2012, as the lead single of his sixth studio album Psy 6 (Six Rules), Part 1, and debuted at number one on South Korea's Gaon Chart. On December 21, 2012, Gangnam Style became the first YouTube video to reach one billion views. The song's music video has since been viewed over 4.1 billion times on YouTube and is the site's most watched video after surpassing Justin Bieber's single Baby in November 2012. It was recognized by Guinness World Records as the first video to reach one billion views on YouTube and became the most viewed video on the site on November 24, 2012.",
    createdAt: formatDateToMySQLDateTime(new Date()),
    updatedAt: formatDateToMySQLDateTime(new Date()),
  });

  const rows = await db.fetchAll("content");
  console.log(rows);

  db.close();
})();
