const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const numblist = [1, 2, 3, 4, 5, 4, 5, 5, 4, 6];

class ExpressError extends Error {
  constructor(msg, status) {
    super(msg);
    this.status = status;
    console.error(this.stack);
  }
}

function getQueryNum(req) {
  let nums = req.query.nums;

  if (!nums) {
    throw new ExpressError("nums query parameter is required.", 400);
  }

  // Convert string "1,2,3,4" → [1,2,3,4]
  let numblist = nums.split(",").map(Number);

  // Validate numbers
  if (numblist.some(isNaN)) {
    throw new ExpressError("All values must be numbers.", 400);
  }
  return numblist;
}

app.get("/", function (req, res, next) {
  return res.send("Hello World!");
});

app.get("/mean", function mean(req, res) {
  try {
    let numblist = getQueryNum(req);
    let calcsum = 0;
    for (let num of numblist) {
      calcsum += num;
    }
    const value = calcsum / numblist.length;
    const response = {
      response: {
        operation: "mean",
        value: value,
      },
    };
    return res.json(response);
  } catch (e) {
    next(e);
  }
});
/** Show JSON on instructor */

app.get("/median", function median(req, res, next) {
  try {
    let numblist = getQueryNum(req);
    let value;
    const sorted = [...numblist].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      value = (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
      value = sorted[middle];
    }

    const response = {
      response: {
        operation: "median",
        value: value,
      },
    };
    return res.json(response);
  } catch (e) {
    next(e);
  }
});

/** Add a new instructor. */

app.get("/mode", function mode(req, res, next) {
  // Do some database operation here...
  try {
    let numblist = getQueryNum(req);
    let mode = {};
    let maxCount = 0;
    let modes = [];

    numblist.forEach((e) => {
      mode[e] = (mode[e] || 0) + 1;
      if (mode[e] > maxCount) {
        maxCount = mode[e];
        modes = [e];
      } else if (mode[e] === maxCount) {
        modes.push(e);
      }
    });

    return res.json({
      response: {
        operation: "mode",
        value: modes,
      },
    });
  } catch (e) {
    next(e);
  }
});

/** Start server on port 3000 */

app.use((req, res, next) => {
  const e = new ExpressError("Page Not Found", 404);
  next(e);
});

// Error handler
app.use(function (err, req, res, next) {
  //Note the 4 parameters!
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status },
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});

module.exports = app;
