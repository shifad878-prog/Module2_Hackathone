const supabaseUrl = "https://gvmyyjvbrmgmwgczqupm.supabase.co";
const supabaseKey = "sb_publishable_c3H02qaCKQ8DlLveDEvIHA_4H5_nKpE";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);



const recipeImage = document.querySelector("#recipeImage");
const imagePreview = document.querySelector("#imagePreview");
const imagePreviewBox = document.querySelector("#imagePreviewBox");
let imageUrl = "";

recipeImage.addEventListener("change", async (event) => {

    const selectedImage = event.target.files[0];

    console.log("Selected Image:", selectedImage);
    console.log("Image Name:", selectedImage?.name);
    console.log("Client:", client);

    if (!selectedImage) {
        console.log("No image selected");
        return;
    }


    // Image Preview
    imagePreview.src = URL.createObjectURL(selectedImage);
    imagePreviewBox.classList.remove("d-none");


    // File name
    const fileName = Date.now() + "-" + selectedImage.name;

    console.log("File Name:", fileName);


    // Supabase Storage
    const { data, error } = await client
        .storage
        .from("Food_img")
        .upload(fileName, selectedImage, {
            cacheControl: "3600",
            upsert: false
        });

    console.log("Upload Data:", data);
    console.log("Upload Error:", error);


    if (error) {
        console.log("Image Upload Error:", error.message);
        return;
    }


    // Public URL
    const { data: publicUrlData } = client
        .storage
        .from("Food_img")
        .getPublicUrl(fileName);

    imageUrl = publicUrlData.publicUrl;

    console.log("Public URL:", publicUrlData.publicUrl);

});


const title = document.querySelector("#recipeTitle");
const category = document.querySelector("#category");
const description = document.querySelector("#description");
const cookingTime = document.querySelector("#cookingTime");
const ingredients = document.querySelector("#ingredients");
const instructions = document.querySelector("#instructions");

const recipeForm = document.querySelector("#recipeForm");


recipeForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    // Values lena
    const recipeTitle = title.value.trim();
    const recipeCategory = category.value;
    const recipeDescription = description.value.trim();
    const recipeCookingTime = cookingTime.value;
    const recipeIngredients = ingredients.value.trim();
    const recipeInstructions = instructions.value.trim();


    // Validation
    if (
        recipeTitle === "" ||
        recipeCategory === "" ||
        recipeDescription === "" ||
        recipeCookingTime === "" ||
        recipeIngredients === "" ||
        recipeInstructions === ""
    ) {

        Swal.fire({
            icon: "warning",
            title: "Missing Data",
            text: "Please fill all fields."
        });

        return;
    }


    // Logged in user
    const { data: userData, error: userError } = await client.auth.getUser();

    if (userError || !userData.user) {

        Swal.fire({
            icon: "error",
            title: "Login Required",
            text: "Please login first."
        });

        return;
    }


    const userId = userData.user.id;


    // Supabase Insert
    const { data, error } = await client
        .from("Recipe_information")
        .insert([
            {
                user_id: userId,
                Recipe_Title: recipeTitle,
                Category: recipeCategory,
                Description: recipeDescription,
                Cooking_Time: recipeCookingTime,
                Ingredients: recipeIngredients,
                Instructions: recipeInstructions,
                image_URL: imageUrl,
            }
        ])
        .select();


    if (error) {

        console.log("Insert Error:", error);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message
        });

        return;
    }


    console.log("Recipe Created:", data);


    Swal.fire({
        icon: "success",
        title: "Recipe Saved!",
        text: "Your recipe has been created successfully."
    }).then(() => {

        window.location.href = "./myRecipe.html";

    });


    // Form clear
    title.value = "";
    category.value = "";
    description.value = "";
    cookingTime.value = "";
    ingredients.value = "";
    instructions.value = "";

});