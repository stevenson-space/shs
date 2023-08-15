<template>
    <div>
        <plain-header title="Menus" />
        <div class="menu-dropdown">
            <label for="menu-select">Select a Menu:</label>
            <select id="menu-select" v-model="selectedMenu">
                <option value="jazzmans">Jazzman's Menu</option>
                <option value="pwc-cafe">PWC Cafe Menu</option>
                <option value="deli">Deli Menu</option>
                <option value="special">Special Menu</option>
            </select>
        </div>
        <div class="menu-board">
            <header class="menu-header" v-if="selectedMenu === 'jazzmans'">
                <h1 class="menu-title">Jazzman's Menu</h1>
                <div class="green-line"></div>
            </header>
            <header class="menu-header" v-if="selectedMenu === 'pwc-cafe'">
                <h1 class="menu-title">PWC Menu</h1>
                <div class="green-line"></div>
            </header>
            <header class="menu-header" v-if="selectedMenu === 'deli'">
                <h1 class="menu-title">Deli Menu</h1>
                <div class="green-line"></div>
            </header>
            <header class="menu-header" v-if="selectedMenu === 'special'">
                <h1 class="menu-title">Special Menu</h1>
                <div class="green-line"></div>
            </header>

            <div class="menu-row" v-if="selectedMenu === 'pwc-cafe'">
                <section class="menu-categoryFour">
                    <h2 class="category-title">Açaí Bowl</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Acai Sorbet</li>
                        <li>Granola</li>
                        <li>Chia Seeds</li>
                        <li>Honey</li>
                        <li>Blueberries</li>
                        <li>Blackberries</li>
                        <li>Strawberries</li>
                        <li>Mango</li>
                        <li>Kiwi</li>
                    </ul>
                </section>

                <section class="menu-categoryFour">
                    <h2 class="category-title">Drinks</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Black Milk</li>
                        <li>Matcha Milk</li>
                        <li>Chia Milk</li>
                        <li>Taro Milk</li>
                        <li>Strawberry</li>
                        <li>Mango</li>
                        <li>Dragon Fruit</li>
                        <li>Green Machine</li>
                        <li>Forever Berry</li>
                    </ul>
                </section>



                <section class="menu-categoryFour">
                    <h2 class="category-title">Salad</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Chicken Salad</li>
                        <li>Hearts of Palm</li>
                        <li>Tuna Salad</li>
                        <li>Egg Salad</li>
                        <li>Sweet Potato</li>
                        <li>Custom Salad</li>
                    </ul>
                </section>

                <section class="menu-categoryFour">
                    <h2 class="category-title">To Go</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Antipasto Box</li>
                        <li>Pinwheel Box</li>
                        <li>Protein Box</li>
                        <li>Cottage Cheese Box</li>
                        <li>Crudite Cup</li>
                        <li>Mixed Fruit Cup</li>
                        <li>Fruit Yogurt</li>
                    </ul>
                </section>
            </div>

            <div class="menu-row" v-if="selectedMenu === 'special'">
                <section class="menu-categorySix">
                    <h2 class="category-title">Poké Bowl <br />(Monday)</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Choose Two:</li>
                        <li>Salmon</li>
                        <li>Tuna</li>
                        <li>Shrimp Tempura</li>
                        <li>Tofu</li>
                        <li>Imitation Crab</li>
                        <li>
                            -
                        </li>
                        <li>Toppings:</li>
                        <li>Edamame</li>
                        <li>Mushroom</li>
                        <li>Cucumber</li>
                        <li>Green Onion</li>
                        <li>Carrot</li>
                        <li>Lettuce</li>
                        <li>Ginger</li>
                        <li>Radish</li>
                        <li>-</li>
                        <li>Sauce:</li>
                        <li>Spicy Mayo</li>
                        <li>Soy Sauce</li>
                        <li>Wasabi:</li>

                    </ul>
                </section>

                <section class="menu-categorySix">
                    <h2 class="category-title">Fat Rosie's Tacos (Tuesday)</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Choose Two:</li>
                        <li>Beef</li>
                        <li>Chicken</li>
                        <li>Cauliflower</li>
                        <li>
                            -
                        </li>
                        <li>Sides:</li>
                        <li>Rice & Beans</li>
                       
                        <li>-</li>
                        <li>Toppings;</li>
                        <li>Cheese</li>
                        <li>Lettuce</li>
                        <li>Sour Cream</li>
                        <li>Tomatoes</li>
                        <li>-</li>
                        <li>Sauce:</li>
                        <li>Spicy</li>
                        <li>Mild</li>
                    </ul>
                </section>



                <section class="menu-categorySix">
                    <h2 class="category-title">Chicken Wing (Wednesday)</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Choice Of:</li>
                        <li>Boneless</li>
                        <li>Bone-In</li>
                        <li>-</li>
                        <li>Sides:</li>
                        <li>Fries</li>
                        <li>-</li>
                        <li>Flavor (Dry):</li>
                        <li>Lemon Pepper</li>
                        <li>Parmesan</li>
                        <li>Flavor (Wet):</li>
                        <li>Spicy</li>
                        <li>BBQ</li>
                    </ul>
                </section>

                <section class="menu-categorySix">
                    <h2 class="category-title">Stevenson Sushi (Friday)</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Choose 8 Pieces:</li>
                        <li>California</li>
                        <li>Salmon</li>
                        <li>Philidelphia</li>
                        <li>Tuna Roll</li>
                        <li>Rainbow</li>
                        <li>Spicy Crab</li>
                        <li>Shrimp Tempura</li>
                    </ul>
                </section>
            </div>

            <div class="menu-row" v-if="selectedMenu === 'pwc-cafe'">
                <section class="menu-categoryThree">
                    <h2 class="category-title">Tea/Coffee</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Coffee</li>
                        <li>Latte Hot</li>
                        <li>Latte Iced</li>
                        <li>Latte Iced Caramel</li>
                        <li>Mocha Hot</li>
                        <li>Mocha Iced</li>
                        <li>Monin Tea</li>
                        <li>Americano</li>
                        <li>Cappucino</li>
                        <li>Hot Chocolate</li>
                    </ul>
                </section>

                <section class="menu-categoryThree">
                    <h2 class="category-title">Wraps</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Power Wrap</li>
                        <li>Thai Wrap</li>
                        <li>Veggie Wrap</li>
                    </ul>
                </section>

                <section class="menu-categoryThree">
                    <h2 class="category-title">Pastries</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Caprese Puff </li>
                        <li>Ham & Cheese </li>
                    </ul>
                </section>

                <section class="menu-categoryThree">
                    <h2 class="category-title">Oats</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Autumn Harvest</li>
                        <li>Strawberry Cheesecake</li>
                        <li>Mango Chia</li>
                    </ul>
                </section>
            </div>

            <div class="menu-row" v-if="selectedMenu === 'jazzmans'">
                <section class="menu-category">
                    <h2 class="category-title">Classics</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Latte & Cappuccino</li>
                        <li>Mocha</li>
                        <li>Espresso</li>
                        <li>Americano</li>
                        <li>Regular or Decaf Coffee</li>
                        <li>Iced Coffee</li>
                        <li>Hot Chocolate</li>
                        <li>Flavored Steamer</li>
                    </ul>
                </section>

                <section class="menu-categoryTwo">
                    <h2 class="category-title">Snacks</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Chips</li>
                        <li>Hummus & Pita</li>
                        <li>Yogurt Parfait</li>
                        <li>Grapes & Cheese</li>
                        <li>Fruit Cup</li>
                        <li>Jello</li>
                        <li>Pasta-Salad</li>
                        <li>Pudding</li>
                    </ul>
                </section>

                <section class="menu-category">
                    <h2 class="category-title">Tea</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Iced Blueberry Green Tea</li>
                        <li>Hot Tea</li>
                        <li>Hot or Iced Tea Latte</li>

                        <li>Chai</li>
                        <li>Coco Coconut</li>
                        <li>Green Tea Matcha</li>

                        <li>Iced Tea</li>
                    </ul>
                </section>

                <section class="menu-category">
                    <h2 class="category-title">Bakery</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Muffins</li>
                        <li>Cookies</li>
                        <li>Turnovers</li>
                        <li>Scones</li>
                        <li>Brownies</li>
                        <li>Bagels</li>
                        <li>Cinnamon Roll</li>
                    </ul>
                </section>
            </div>

            <div class="menu-row" v-if="selectedMenu === 'jazzmans'">
                <section class="menu-categoryTwo">
                    <h2 class="category-title">Sandwiches</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Turkey & Cheese</li>
                        <li>Italian Sandwich</li>
                        <li>Chicken Salad</li>
                        <li>Ham & Swiss</li>
                    </ul>
                </section>

                <section class="menu-categoryTwo">
                    <h2 class="category-title">Wraps</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Buffalo Chicken</li>
                        <li>Hummus & Roasted Veggie</li>
                        <li>Chicken Caesar</li>
                        <li>Caesar Wrap</li>
                        <li>Turkey Bacon</li>
                    </ul>
                </section>

                <section class="menu-categoryTwo">
                    <h2 class="category-title">Salads</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Buffalo Chicken</li>
                        <li>Garden Salad</li>
                        <li>Chicken Caesar</li>
                        <li>Caesar Salad</li>
                        <li>Quinoa Salad</li>
                    </ul>
                </section>

                <section class="menu-category">
                    <h2 class="category-title">Good Stuff</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Caramel Delight</li>
                        <li>Caramel Latte</li>
                        <li>White Chocolate Mocha</li>
                        <li>Crème Brûlée</li>
                        <li>Tuxedo</li>
                    </ul>
                </section>
            </div>
            <div class="menu-row" v-if="selectedMenu === 'deli'">
                <section class="menu-categoryFive">
                    <h2 class="category-title">Bread</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>White Bread</li>
                        <li>Wheat Bread</li>
                        <li>9 Grain</li>
                        <li>Pretzel Bun</li>
                        <li>Kaiser Roll</li>
                        <li>Tortilla</li>
                    </ul>
                </section>

                <section class="menu-categoryFive">
                    <h2 class="category-title">Protein</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Roast Beef</li>
                        <li>Turkey</li>
                        <li>Ham</li>
                        <li>Salami</li>
                        <li>BBQ Chicken</li>
                        <li>Buffalo Chicken</li>
                        <li>Hummus</li>
                    </ul>
                </section>

                <section class="menu-categoryFive">
                    <h2 class="category-title">Toppings</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Lettuce</li>
                        <li>Tomato</li>
                        <li>Onion</li>
                        <li>Pickles</li>
                        <li>Olives</li>
                        <li>Cucumber</li>
                        <li>Swiss Cheese</li>
                        <li>Provolone</li>
                        <li>Cheddar</li>
                        <li>Pepper Jack</li>
                    </ul>
                </section>

                <section class="menu-categoryFive">
                    <h2 class="category-title">Sauce</h2>
                    <div class="small-green-line"></div>
                    <ul>
                        <li>Chipotle</li>
                        <li>Mustard</li>
                        <li>Ketchup</li>
                        <li>Ranch</li>
                        <li>Honey Mustard</li>
                    </ul>
                </section>

            </div>

        </div>
        
    </div>
</template>

<script>
    import PlainHeader from '@/components/HomeLink.vue'; // Update the import path accordingly
    export default {
        components: {
            PlainHeader,
        },
        data() {
            return {
                selectedMenu: 'jazzmans', // Default selection
            };
        },
    };
</script>

<style lang="sass">
@import 'src/styles/style.sass'

.menu-dropdown
    text-align: center
    margin: 20px 0

.menu-select
    padding: 5px 10px
    border: 1px solid #ccc
    border-radius: 4px
    font-size: 16px




.plain-header
  max-width: $content-width
  margin: auto
  position: relative
  margin-top: 10px
  color: var(--color)
  +mobile
    text-align: center

.title
    line-height: 120px
    font-size: 3.5em
    font-weight: bold
    margin-left: 10px
    +mobile
      margin-left: 0

.home-link
    position: absolute
    top: 10px
    right: 15px
    +mobile-small
      top: 0
      right: 5px


.menu-board
    display: flex
    flex-direction: column
    align-items: center
    justify-content: flex-start
    min-height: 100vh
    padding: 20px 0
    background-color: #fefffe /* White background */
    color: #040f0f /* Rich black (FOGRA29) */

.menu-header
    text-align: center
    margin-bottom: 30px

.green-line
    width: 60px
    height: 2px
    background-color: #040f0f /* Phthalo green */
    margin: 10px auto

.small-green-line
    width: 30px
    height: 2px
    background-color: #040f0f /* Phthalo green */
    margin: 10px auto

.menu-row
    display: flex
    justify-content: center

.menu-category
    margin-right: 70px
    margin-left: 70px
    text-align: center
    flex: 1

.menu-categoryTwo
    margin-right: 70px
    margin-left: 70px
    text-align: center
    flex: 1

.menu-categoryThree
    margin-right: 90px
    margin-left: 90px
    text-align: center
    flex: 1

.menu-categoryFour
    margin-right: 90px
    margin-left: 90px
    text-align: center
    flex: 1

.menu-categoryFive
    margin-right: 97px
    margin-left: 97px
    text-align: center
    flex: 1

.menu-categorySix
    margin-right: 25px
    margin-left: 25px
    text-align: center
    flex: 1
.category-title
    font-size: 24px
    color: var(--color) /* Silver sand */

.menu-category ul
    list-style-type: none
    padding-left: 0

.menu-category li
    margin: 5px 0
    font-size: 18px
    color: #8c8c8c /* Dark gray text color */

.menu-categoryTwo ul
    list-style-type: none
    padding-left: 0

.menu-categoryTwo li
    margin: 5px 0
    font-size: 18px
    color: #8c8c8c /* Dark gray text color */

.menu-categoryThree ul
    list-style-type: none
    padding-left: 0

.menu-categoryThree li
    margin: 5px 0
    font-size: 18px
    color: #8c8c8c /* Dark gray text color */

.menu-categoryFour ul
    list-style-type: none
    padding-left: 0

.menu-categoryFour li
    margin: 5px 0
    font-size: 18px
    color: #8c8c8c /* Dark gray text color */

.menu-categoryFive ul
    list-style-type: none
    padding-left: 0

.menu-categoryFive li
    margin: 5px 0
    font-size: 18px
    color: #8c8c8c /* Dark gray text color */

.menu-categorySix ul
    list-style-type: none
    padding-left: 0

.menu-categorySix li
    margin: 5px 0
    font-size: 18px
    color: #8c8c8c /* Dark gray text color */


.menu-title
    font-size: 32px
    color: var(--color) /* Phthalo green */
</style>