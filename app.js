var bodyParser =require("body-parser"),
methodOverride=require("method-override"),
mongoose=require("mongoose"),
express=require("express"),
expressSanitizer = require("express-sanitizer"),
app=express();

mongoose.connect("mongodb://localhost:27017/blog_app_REST");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type: Date, default: Date.now}
});

var blog = mongoose.model("blog", blogSchema);

// blog.create({
//     title: "test blog",
//     image:"https://images.pexels.com/photos/264109/pexels-photo-264109.jpeg?auto=compress&cs=tinysrgb&h=350",
//     body:"Hello there"
// });


//ROUTES

app.get("/", function(req,res){
    res.redirect("/blogs");
});


app.get("/blogs", function(req,res){
    blog.find({}, function(err,blogs){
        if(err){
            console.log("there is an error");
            
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
   
    
});

//NEW

app.get("/blogs/new", function(req,res){
    res.render("new");
});



//POST
app.post("/blogs", function(req,res){
    
    blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
});


app.get("/blogs/:id", function(req,res){
    blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundBlog})
        }
    });
    
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
    blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    });
    
});

//UPDATE route//PUT ROUTE
app.put("/blogs/:id", function(req,res){
    blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+ req.params.id);
        }
        
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running");
});
