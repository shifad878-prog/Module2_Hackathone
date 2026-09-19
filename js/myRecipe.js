const supabaseUrl = "https://gvmyyjvbrmgmwgczqupm.supabase.co";
const supabaseKey = "sb_publishable_c3H02qaCKQ8DlLveDEvIHA_4H5_nKpE";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);

const myRecipesContainer = document.querySelector("#myRecipesContainer");
const noRecipesMessage = document.querySelector("#noRecipesMessage");

const logoutBtn = document.querySelector("#logoutBtn");


// LOGOUT 

logoutBtn.addEventListener("click", async () => {

    const { error } = await client.auth.signOut();

    if (error) {
        console.log(error);
        return;
    }

    window.location.href = "./login.html";

});


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


// ================= RUN FUNCTION =================

getMyRecipes();