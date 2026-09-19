const supabaseUrl = "https://gvmyyjvbrmgmwgczqupm.supabase.co";
const supabaseKey = "sb_publishable_c3H02qaCKQ8DlLveDEvIHA_4H5_nKpE";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);

const signupForm = document.querySelector("#signupForm");

signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // 1: Validation 
    


})