# FEEDME ♡ ₊˚⊹𓌉◯𓇋₊˚⊹ ♡ - Find recipes easily
- FEEDME is a simple web app that helps users find and favourite recipes easily. The app is built using HTML, CSS, Javascript and Edamam API. It allows any user, from busy working individuals and  home cooks to students, to save time by quickly choosing appropriate meals, bookmarking their favourites, and accessing them later as well as analyzing the nutritional value of their food items. 


## 💻Features
•	🔎 Search bar, search button and search filters : So that users can search for recipes based on ingredients, dietary restrictions, and cuisines and filter the results according to their preferences/dietary needs.
•	🍉🥝 Nutrition Analyzer: Enables users to input raw ingredients/ food items (e.g., "1 apple", "100g chicken breast") and receive a comprehensive nutritional breakdown including calories content, protein, fat content etc. tailored to the users input.
•	🍴 Recipe cards/pages : These display the cooking steps as well as the ingredients needed, nutritional information and images of the cooked meal.

•	❤️ Favourites: Users can bookmark/heart recipes for future reference.

•	🌙 Dark mode : To make the app fully responsive for any device and comfortable for the eyes.

## ⛏️🔨 Tech Stack 
•	Frontend: HTML,CSS,Javascript

•	Backend/API: Edamam API : The FeedMe online application utilizes the Edamam API to improve its functionality by giving users access to many recipes and extensive information about each one. The API allows the application to get recipe data, such as ingredients, step-by-step cooking instruction, nutritional information, and images.  This allows users to try new recipes and get a better knowledge of how to prepare them. Users can also search for recipes using keywords like "chicken" or "pasta" and use filters to narrow down their findings.  They will also be able to filter recipes based on specific components, select dishes from different cuisines such as Indian or Mexican for example, and search for options that meet their dietary preferences or constraints, such as vegetarian, vegan, or gluten-free diets.In addition, the app also includes a Nutrition Analyzer tool that is powered by a separate Edamam endpoint, which enables users to input individual food items or ingredients and receive a complete nutritional breakdown. This feature supports users in making informed dietary choices by understanding the calorie and macronutrient content of custom meals or everyday foods.

•	Deployment:  FeedMe is hosted Netlify.Once the development part is complete, the app will be published to Netlify and made available online.  Netlify makes the process easier by offering a user-friendly platform for hosting static webpages and online applications. However, The source code is also available on GitHub and can be cloned or downloaded locally. Instructions for local setup are provided below to allow users to run and explore the app in their browsers.


## ⬇️Installation
To host locally:
1. Clone the Repository
   
git clone https://github.com/piadevaniya8/IU_DLBCSPJWD01-FEEDME.git

3. Navigate into the Project Directory

 cd IU_DLBCSPJWD01-FEEDME

5. Simply open the index.html file in any modern web browser:
   
  Double-click index.html
  
✅ Requirements

•	A modern web browser (Chrome, Firefox, Edge, etc.)

•	No installation or backend setup required — everything runs in the browser

•	Internet connection (to connect to the Edamam API)

FeedMe also hosted on Netlify. 
Just simply click on the URL 👉 : https://iufeedme.netlify.app/

## ✅Test Cases
✅Test case 1: User can search for an ingredient or dish

•Click on the search field and type an ingredient or dish. Test Data: search any ingredient/dish e.g. "chicken“, "pasta with pesto“, "gluten-free brownies“.

 •Click the search button.
 
•Expected outcome: Edamam API returns data from the keyword that was searched, and recipes/recipe cards are shown.

 ✅Test case 2: User can filter recipes      
 
  •After a keyword has been searched , click on the filter and choose an option. Test Data: Search "salad", then select "Cuisine Type: Italian", "Diet Type: High-Fiber", "Health Labels: Vegetarian".
  
•Expected outcome: Recipes will be filtered according to the users search and filters they chose.

✅Test case 3 : User can view contents of recipe cards:

•Click on the view recipe button. Test data: e.g., Click the view recipe button on "Zucchini and Almond Pasta Salad“.

•Expected outcome: Recipe content like the picture of the dish, the ingredients, nutritional value and link to the original recipe website should show up.

✅Test case 4 : User can toggle dark mode

•Click on the dark mode button

•Expected outcome: When the website is currently in light mode and the dark mode button is clicked, the website turns to darker colours (dark mode). When the website is currently in dark mode and dark mode button is clicked, the website turns to light colours (light mode).

✅Test case 5: User can favourite recipes

•Click on the white heart on the recipe card. Test data: e.g.,  Click on white heart on “Zucchini and Almond Pasta Salad".

•Expected outcome: The heart turns red and a green message pops up at the bottom of the screen saying that the recipe has been added to my favourites.

✅Test case 6 : User can unfavourite recipes:

•Click on red heart at bottom of recipe card. Test data: e.g.,  Click on red heart on “Zucchini and Almond Pasta Salad".

•Expected outcome: The red heart turns white and a blue message pops up at the bottom of the screen saying that the recipe has been removed from favourites.

✅Test case 7: User can find the nutritional content of a food item / ingredients list
Type a food item / ingredient/s into the search field of the nutrition analyzer ( e.g 50g oats, 1 large apple).
Then click the Analyze button
Expected outcome: Edamam API returns nutritional data tailored to the users input. ( calories,protein,fat content etc. )

✅Test case 8: User can clear nutritional content and search input of Nutrition Analyzer
Click on the clear button
Expected Outcome: Nutritional data generated by Edamam API is cleared and search input is cleared. Nutritional Analyzer goes back to its original state before search input.





