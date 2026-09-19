const supabaseUrl = "https://gvmyyjvbrmgmwgczqupm.supabase.co";
const supabaseKey = "sb_publishable_c3H02qaCKQ8DlLveDEvIHA_4H5_nKpE";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);

const signupForm = document.querySelector("#signupForm");
const signupBtn = document.querySelector("#signupBtn");
const fullName = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // 1: Validation 
    if (
        fullName.value === "" ||
        email.value === "" ||
        password.value === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    // Supabase signup
    try {

        const { data, error } = await client.auth.signUp({
            email: email.value,
            password: password.value
        });

        if (error) {
            alert(error.message);
            return;
        }


        // Save user data in database
        const { data: database, error: databaseError } = await client
            .from("user_data")
            .insert({
                fullName: fullName.value,
                email: email.value,
                user_id: data.user.id
            })
            .select();


        if (databaseError) {
            console.log(databaseError);
            alert(databaseError.message);
            return;
        }


        console.log("Auth User:", data);
        console.log("Database User:", database);

        alert("Account created successfully!");


        // Redirect to dashboard
        window.location.href = "./dashboard.html";


    } catch (error) {

        console.log(error);
        alert("Something went wrong");

    }
})