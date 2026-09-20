const supabaseUrl = "https://gvmyyjvbrmgmwgczqupm.supabase.co";
const supabaseKey = "sb_publishable_c3H02qaCKQ8DlLveDEvIHA_4H5_nKpE";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);


// HTML elements
const userName = document.querySelector("#userName");
const profileName = document.querySelector("#profileName");
const userEmail = document.querySelector("#userEmail");
const userInitial = document.querySelector("#userInitial");
const logoutBtn = document.querySelector("#logoutBtn");
const welcomeName = document.querySelector("#welcomeName");
const recentRecipesContainer =
    document.querySelector("#recentRecipesContainer");
const noRecipesMessage =
    document.querySelector("#noRecipesMessage");


// Get logged in user
async function getUser() {

    const { data, error } = await client.auth.getUser();

    console.log("Auth User:", data);
    console.log("Auth Error:", error);

    if (error) {
        console.log(error);
        return;
    }

    if (!data.user) {
        window.location.href = "./login.html";
        return;
    }

    const userId = data.user.id;
    const email = data.user.email;

    console.log("User ID:", userId);
    console.log("Logged in Email:", email);


    // Get user from user_data
    const { data: userData, error: userError } = await client
        .from("user_data")
        .select("*")
        .eq("user_id", userId)
        .single();

    console.log("Database User:", userData);
    console.log("Database Error:", userError);


    if (userError) {
        console.log(userError);
        return;
    }


    // Show data
    userName.innerHTML = userData.fullName;
    profileName.innerHTML = userData.fullName;
    userEmail.innerHTML = userData.email;

    // Show first letter
    userInitial.innerHTML =
        userData.fullName.charAt(0).toUpperCase();


    // Show signup user's name in Welcome section
    welcomeName.innerHTML = userData.fullName;
}


logoutBtn.addEventListener("click", async () => {

    const { error } = await client.auth.signOut();

    if (error) {
        console.log(error);
        return;
    }

    window.location.href = "./login.html";
});


getUser();


async function getRecentRecipes() {

    const { data: recipes, error } = await client
        .from("Recipe_information")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

    console.log("Recent Recipes:", recipes);
    console.log("Recent Recipes Error:", error);

    if (error) {
        console.log(error);
        return;
    }

    recentRecipesContainer.innerHTML = "";

    if (!recipes || recipes.length === 0) {

        recentRecipesContainer.classList.add("d-none");
        noRecipesMessage.classList.remove("d-none");

        return;
    }

    recentRecipesContainer.classList.remove("d-none");
    noRecipesMessage.classList.add("d-none");

    recipes.forEach((recipe) => {

        const card = document.createElement("div");

        card.className = "col-12 col-md-6 col-lg-4";

        card.innerHTML = `
            <div class="card shadow-sm h-100">

                <img
                    src="${recipe.image_URL || 'https://via.placeholder.com/600x350?text=Recipe'}"
                    class="card-img-top"
                    style="height:220px; object-fit:cover;"
                    alt="${recipe.Recipe_Title}"
                >

                <div class="card-body p-4">

                    <span class="badge bg-warning text-dark">
                        ${recipe.Category}
                    </span>

                    <h5 class="fw-bold mt-3">
                        ${recipe.Recipe_Title}
                    </h5>

                    <p class="text-muted">
                        ${recipe.Description}
                    </p>

                    <div class="d-flex justify-content-between">

                        <small class="text-muted">
                            ⏱ ${recipe.Cooking_Time} min
                        </small>

                        <button
                            onclick="viewRecipe(${recipe.id})"
                            class="btn btn-link text-decoration-none p-0">
                            View Recipe →
                        </button>

                    </div>

                </div>

            </div>
        `;

        recentRecipesContainer.appendChild(card);
    });
}

getUser();
getRecentRecipes();