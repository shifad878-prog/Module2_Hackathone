const supabaseUrl = "https://gvmyyjvbrmgmwgczqupm.supabase.co";
const supabaseKey = "sb_publishable_c3H02qaCKQ8DlLveDEvIHA_4H5_nKpE";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);


const recipeDetails = document.querySelector("#recipeDetails");

async function getRecipeDetails() {

    const urlParams = new URLSearchParams(window.location.search);

    const recipeId = urlParams.get("id");

    console.log("Recipe ID:", recipeId);

    if (!recipeId) {
        recipeDetails.innerHTML = `
            <div class="alert alert-danger">
                Recipe not found.
            </div>
        `;
        return;
    }

    const { data: recipe, error } = await client
        .from("Recipe_information")
        .select("*")
        .eq("id", recipeId)
        .single();

    console.log("Recipe:", recipe);
    console.log("Error:", error);

    if (error) {

        recipeDetails.innerHTML = `
            <div class="alert alert-danger">
                ${error.message}
            </div>
        `;

        return;
    }

    recipeDetails.innerHTML = `

        <div class="row g-4">

            <!-- IMAGE -->

            <div class="col-lg-6">

                <img
                    src="${recipe.image_URL || 'https://via.placeholder.com/700x500?text=Recipe'}"
                    class="img-fluid rounded-4 shadow-sm w-100"
                    style="height:450px; object-fit:cover;"
                    alt="${recipe.Recipe_Title}"
                >

            </div>


            <!-- DETAILS -->

            <div class="col-lg-6">

                <span class="badge bg-warning text-dark mb-3">
                    ${recipe.Category}
                </span>

                <h1 class="fw-bold mb-3">
                    ${recipe.Recipe_Title}
                </h1>

                <p class="text-muted">
                    ${recipe.Description}
                </p>

                <p>
                    <strong>Cooking Time:</strong>
                    ${recipe.Cooking_Time} minutes
                </p>

                <hr>

                <h4 class="fw-bold">
                    Ingredients
                </h4>

                <p>
                    ${recipe.Ingredients}
                </p>

                <hr>

                <h4 class="fw-bold">
                    Instructions
                </h4>

                <p>
                    ${recipe.Instructions}
                </p>

            </div>

        </div>

    `;
}

getRecipeDetails();