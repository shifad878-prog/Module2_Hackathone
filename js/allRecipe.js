const supabaseUrl = "https://gvmyyjvbrmgmwgczqupm.supabase.co";
const supabaseKey = "sb_publishable_c3H02qaCKQ8DlLveDEvIHA_4H5_nKpE";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);


const allRecipesContainer = document.querySelector("#allRecipesContainer");


// ================= GET ALL RECIPES =================

async function getAllRecipes() {

    const { data: recipes, error } = await client
        .from("Recipe_information")
        .select("*")
        .order("created_at", { ascending: false });

    console.log("All Recipes:", recipes);
    console.log("Recipe Error:", error);

    if (error) {
        console.log(error);
        return;
    }

    allRecipesContainer.innerHTML = "";

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

                    <p class="mb-3">
                        <strong>Cooking Time:</strong>
                        ${recipe.Cooking_Time} minutes
                    </p>

                    <button
                        class="btn btn-primary btn-sm"
                        onclick="viewRecipe(${recipe.id})">
                        View
                    </button>

                </div>

            </div>

        `;

        allRecipesContainer.appendChild(card);

    });

}




// ================= VIEW RECIPE =================

window.viewRecipe = function (id) {

    console.log("Selected Recipe ID:", id);

    window.location.href = "./recipeDetails.html?id=" + id;

};



// RUN FUNCTION 

getAllRecipes();