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