<template>
  <div class="menu-board">
    <header class="menu-header">
      <h1 class="menu-title">Jazzman's Menu</h1>
      <div class="green-line"></div>
    </header>

    <div class="menu-row">
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

      <section class="menu-category">
        <h2 class="category-title">Tea</h2>
        <div class="small-green-line"></div>
        <ul>
          <li>Iced Blueberry Green Tea</li>
          <li>Hot Tea</li>
          <li>Hot or Iced Tea Latte</li>
          <ul>
            <li>Chai</li>
            <li>Coco Coconut</li>
            <li>Green Tea Matcha</li>
          </ul>
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

    <div class="menu-row">
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
    </div>
  </div>
</template>

<style lang="sass">
  @import 'src/styles/style.sass'

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
    background-color: #eec643 /* Phthalo green */
    margin: 10px auto

  .small-green-line
    width: 30px
    height: 2px
    background-color: #eec643 /* Phthalo green */
    margin: 10px auto

  .menu-row
    display: flex
    justify-content: center

  .menu-category
    margin: 20px
    text-align: center
    flex: 1

  .menu-categoryTwo
    margin: 28px
    text-align: center
    flex: 1

  .category-title
    font-size: 24px
    color: #00a859 /* Silver sand */

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

  .menu-title
    font-size: 32px
    color: #183c28 /* Phthalo green */
</style>