import axios from 'axios';
import { key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;  
            this.url = res.data.recipe.source_url;  
            this.ingredients = res.data.recipe.ingredients;  
        } catch (error) {
            console.error('Error');
        }
    }

    calcTime() {
        // Assuming that we need 15 min for each ingredient
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const newIngredients = this.ingredients.map(ing => {
            // 1. Uniform units
            let ingredient = ing.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            })

            // 2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\ */g, ' ');


            // 3. Parse Ingredients into count, unit, and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(ings => unitsShort.includes(ings));

            if (unitIndex > -1) {
                // There is a unit
            } else if (parseInt(arrIng[0], 10)) {
                // There is no unit, but 1st element is a number
            } else if (unitIndex === -1) {
                // There is no unit
            }

            return ingredient;
        });
        this.ingredients = newIngredients
    } 
}