module.exports = function (app, shopData) {
  // Handle our routes
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });
  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });
  app.get("/search", function (req, res) {
    res.render("search.ejs", shopData);
  });
  // app.get("/search-result", function (req, res) {
  //   //searching in the database
  //   //res.send("You searched for: " + req.query.keyword);

  // });

  app.get("/search-result", function (req, res) {
    // Retrieve the search keyword from the query parameters
    const searchKeyword = req.query.keyword;

    // Basic search query (exact match)
    let basicSearchQuery = "SELECT * FROM books WHERE name = ?";

    // Advanced search query (partial match)
    let advancedSearchQuery = "SELECT * FROM books WHERE name LIKE ?";

    // Execute the basic search query
    db.query(basicSearchQuery, [searchKeyword], (basicErr, basicResult) => {
      if (basicErr) {
        // Handle error if needed
        res.send("Error in basic search");
      } else {
        // Execute the advanced search query
        db.query(
          advancedSearchQuery,
          [`%${searchKeyword}%`],
          (advancedErr, advancedResult) => {
            if (advancedErr) {
              // Handle error if needed
              res.send("Error in advanced search");
            } else {
              // Combine the results from basic and advanced searches
              const searchResults = {
                basicResults: basicResult,
                advancedResults: advancedResult,
              };

              // Render the search-result.ejs view with the search results
              res.render("search-result.ejs", { searchResults });
            }
          }
        );
      }
    });
  });

  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });
  app.get("/addbook", function (req, res) {
    res.render("addbook.ejs", shopData);
  });

  app.get("/list", function (req, res) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      // If there's an error, redirect to the root
      if (err) {
        res.redirect("./");
      }
      // Combine shopData with the retrieved books and render the "list.ejs" view
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });
  });

  app.get("/bargainbooks", function (req, res) {
    // Query the database to get books with a price less than 20
    let sqlquery = "SELECT name, price FROM books WHERE price < 20"; // query database to get bargain books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("/");
      }
      // Combine shopData with the retrieved books and render the "bargainbooks.ejs" view
      let bargainData = Object.assign({}, shopData, { availableBooks: result });
      console.log(bargainData);
      res.render("bargainbooks.ejs", bargainData);
    });
  });

  app.post("/registered", function (req, res) {
    // saving data in database
    res.send(
      " Hello " +
        req.body.first +
        " " +
        req.body.last +
        " you are now registered!  We will send an email to you at " +
        req.body.email
    );
  });

  app.post("/bookadded", function (req, res) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    // execute sql query
    let newrecord = [req.body.name, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else {
        // Send a success message if the book is added to the database
        res.send(
          " This book is added to database, name: " +
            req.body.name +
            " price " +
            req.body.price
        );
      }
    });
  });
};
