const supabaseUrl = "https://gvmyyjvbrmgmwgczqupm.supabase.co";
const supabaseKey = "sb_publishable_c3H02qaCKQ8DlLveDEvIHA_4H5_nKpE";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);

const myRecipesContainer = document.querySelector("#myRecipesContainer");
const noRecipesMessage = document.querySelector("#noRecipesMessage");

const logoutBtn = document.querySelector("#logoutBtn");


// LOGOUT 

// logoutBtn.addEventListener("click", async () => {

//     const { error } = await client.auth.signOut();

//     if (error) {
//         console.log(error);
//         return;
//     }

//     window.location.href = "./login.html";

// });


/// ================= GET MY RECIPES =================

async function getMyRecipes() {

    // Logged in user
    const { data: userData, error: userError } =
        await client.auth.getUser();

    console.log("User:", userData);

    if (userError || !userData.user) {

        window.location.href = "./login.html";
        return;
    }

    const userId = userData.user.id;

    console.log("User ID:", userId);


    // ================= GET USER NAME =================

    const { data: profile, error: profileError } = await client
        .from("user_data")
        .select("fullName")
        .eq("user_id", userId)
        .single();

    console.log("Profile:", profile);

    if (profileError) {
        console.log("Profile Error:", profileError);
    }


    // ================= GET MY RECIPES =================

    const { data: recipes, error: recipesError } = await client
        .from("Recipe_information")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });


    console.log("My Recipes:", recipes);


    if (recipesError) {

        console.log("Recipe Error:", recipesError);

        return;
    }


    // Clear old cards
    myRecipesContainer.innerHTML = "";


    // No recipes
    if (!recipes || recipes.length === 0) {

        noRecipesMessage.classList.remove("d-none");

        return;
    }


    // Hide empty message
    noRecipesMessage.classList.add("d-none");


    // ================= CREATE CARDS =================

    recipes.forEach((recipe) => {

        const card = document.createElement("div");

        card.className = "col-md-6 col-lg-4";


        card.innerHTML = `

            <div class="card border-0 shadow-sm h-100">

                <img 
                    src="${recipe.image_URL || 'https://via.placeholder.com/600x350?text=Recipe'}"
                    class="card-img-top"
                    style="height:220px; object-fit:cover;"
                    alt="${recipe.Recipe_Title}"
                >

                <div class="card-body">

                    <span class="badge bg-warning text-dark mb-2">
                        ${recipe.Category}
                    </span>

                    <h4 class="fw-bold">
                        ${recipe.Recipe_Title}
                    </h4>

                    <p class="text-muted">
                        ${recipe.Description}
                    </p>

                    <p class="mb-2">
                        <strong>Cooking Time:</strong>
                        ${recipe.Cooking_Time} minutes
                    </p>

                    <p class="text-muted small">
                        <strong>Author:</strong>
                        ${profile?.fullName || "Unknown"}
                    </p>

                    <div class="d-flex gap-2">

                        <button 
                            class="btn btn-primary btn-sm"
                            onclick="viewRecipe(${recipe.id})">
                            View
                        </button>

                        <button 
                            class="btn btn-warning btn-sm"
                            onclick="editRecipe(${recipe.id})">
                            Edit
                        </button>

                        <button 
                            class="btn btn-danger btn-sm"
                            onclick="deleteRecipe(${recipe.id})">
                            Delete
                        </button>

                    </div>

                </div>

            </div>

        `;


        myRecipesContainer.appendChild(card);

    });

}



// RUN FUNCTION 

getMyRecipes();


// edit btn 

window.editRecipe = async function (id) {

    // Recipe database se get karo
    const { data: recipe, error } = await client
        .from("Recipe_information")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.log("Edit Recipe Error:", error);
        return;
    }


    // SweetAlert Edit Form
    const { value: formValues } = await Swal.fire({

        title: "Edit Recipe",

        html: `

            <input 
                id="swalTitle"
                class="swal2-input"
                placeholder="Recipe Title"
                value="${recipe.Recipe_Title || ""}"
            >

            <select id="swalCategory" class="swal2-select">

                <option value="Pakistani">Pakistani</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Desserts">Desserts</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Healthy">Healthy</option>

            </select>

            <textarea
                id="swalDescription"
                class="swal2-textarea"
                placeholder="Description"
            >${recipe.Description || ""}</textarea>

            <input
                id="swalCookingTime"
                type="number"
                class="swal2-input"
                placeholder="Cooking Time"
                value="${recipe.Cooking_Time || ""}"
            >

            <textarea
                id="swalIngredients"
                class="swal2-textarea"
                placeholder="Ingredients"
            >${recipe.Ingredients || ""}</textarea>

            <textarea
                id="swalInstructions"
                class="swal2-textarea"
                placeholder="Instructions"
            >${recipe.Instructions || ""}</textarea>

        `,

        confirmButtonText: "Update Recipe",
        showCancelButton: true,
        cancelButtonText: "Cancel",

        focusConfirm: false,

        didOpen: () => {

            document.querySelector("#swalCategory").value =
                recipe.Category || "";

        },

        preConfirm: () => {

            const title =
                document.querySelector("#swalTitle").value.trim();

            const category =
                document.querySelector("#swalCategory").value;

            const description =
                document.querySelector("#swalDescription").value.trim();

            const cookingTime =
                document.querySelector("#swalCookingTime").value;

            const ingredients =
                document.querySelector("#swalIngredients").value.trim();

            const instructions =
                document.querySelector("#swalInstructions").value.trim();


            if (
                !title ||
                !category ||
                !description ||
                !cookingTime ||
                !ingredients ||
                !instructions
            ) {

                Swal.showValidationMessage(
                    "Please fill all fields"
                );

                return false;
            }


            return {
                title,
                category,
                description,
                cookingTime,
                ingredients,
                instructions
            };
        }

    });


    // Cancel kiya
    if (!formValues) {
        return;
    }


    // ================= UPDATE =================

    const { data, error: updateError } = await client
        .from("Recipe_information")
        .update({

            Recipe_Title: formValues.title,
            Category: formValues.category,
            Description: formValues.description,
            Cooking_Time: formValues.cookingTime,
            Ingredients: formValues.ingredients,
            Instructions: formValues.instructions

        })
        .eq("id", id)
        .select();


    console.log("Updated Recipe:", data);
    console.log("Update Error:", updateError);


    if (updateError) {

        Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: updateError.message
        });

        return;
    }


    // Success
    Swal.fire({
        icon: "success",
        title: "Recipe Updated!",
        text: "Your recipe has been updated successfully."
    }).then(() => {

        getMyRecipes();

    });

};


// delt btn 
window.deleteRecipe = async function (id) {

    // Confirmation Alert
    const result = await Swal.fire({

        title: "Are you sure?",
        text: "This recipe will be permanently deleted.",
        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",

        confirmButtonColor: "#dc3545"

    });


    // Agar Cancel kiya
    if (!result.isConfirmed) {
        return;
    }


    // DELETE RECIPE

    const { error } = await client
        .from("Recipe_information")
        .delete()
        .eq("id", id);


    console.log("Delete Error:", error);


    if (error) {

        Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: error.message
        });

        return;
    }


    // SUCCESS 

    Swal.fire({
        icon: "success",
        title: "Recipe Deleted!",
        text: "Your recipe has been deleted successfully."
    }).then(() => {

        // Recipes dobara load karo
        getMyRecipes();

    });

};