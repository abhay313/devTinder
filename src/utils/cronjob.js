const cron = require("node-cron");
const sendEmail = require("./sendEmail");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");

cron.schedule("33 0 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gt: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((request) => request.toUserId.emailId)),
    ];

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          "New request pending for " + email,
          "There are many people interested in you please login to devtindur and let them know what oyu think"
        );
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }
});
