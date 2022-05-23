let total = sportsmenList.length;
// ======================= Заполнение сводной таблицы =======================
let consolidateTable = document.querySelector('.consolidate__table');
let tableHead = document.querySelector('.consolidate__header');   // переменная ждя хранения общей шапки таблиц

let sortItemList = document.querySelectorAll('.sortList__input'); // переменная для хранения списка пунктов сортировки

sortItemList.forEach( item => {
  let sortName = item.dataset.sortName;
  let sortReverse = item.dataset.sortReverse;
  let consolidateRowList;

  item.addEventListener('click', () => {
    consolidateRowList = consolidateTable.querySelectorAll('.consolidate__row');

    if (sortReverse == 'true' && item.checked) {
      consolidateRowList.forEach( item => item.remove());
      sportsmenList.sort(sortByFieldReverse(sortName));
      makeConsolidateTable();
    } else if (sortReverse != 'true' && item.checked) {
      consolidateRowList.forEach( item => item.remove());
      sportsmenList.sort(sortByField(sortName));
      makeConsolidateTable();
    }
  })

})

function makeConsolidateTable() {
  for (let i = 0; i < total; i++) {
    let [lastName, name] = sportsmenList[i].fullName.split(" ");

    if (sportsmenList[i].ku == null) sportsmenList[i].ku = '-';

    consolidateTable.querySelector('tbody').insertAdjacentHTML('beforeend',
    `<tr class="consolidate__row">
      <td class="consolidate__cell consolidate__cell_center">${i+1}</td>
      <td class="consolidate__cell">${lastName}</td>
      <td class="consolidate__cell">${name}</td>
      <td class="consolidate__cell consolidate__cell_center">${sportsmenList[i].age}</td>
      <td class="consolidate__cell consolidate__cell_center">${sportsmenList[i].weight}</td>
      <td class="consolidate__cell consolidate__cell_center">${sportsmenList[i].ku}</td>
      <td class="consolidate__cell consolidate__cell_center">${sportsmenList[i].gender.toLowerCase()}</td>
      <td class="consolidate__cell consolidate__cell_center">${sportsmenList[i].city}</td>
      <td class="consolidate__cell">${sportsmenList[i].coach}</td>
    </tr>`);
  }
}

makeConsolidateTable();
// ======================= Заполнение таблиц по категориям =======================

let categoriesMale = {
  '4-5': [],
  '6-7': [20, 25],
  '8-9': [25, 30],
  '10-11': [30, 35, 40],
  '12-13': [35, 40],
  '14-15': [55, 60, 65],
}

let categoriesFemale = {
  '4-5': [],
  '6-7': [],
  '8-9': [],
  '10-11': [],
  '12-13': [],
  '14-15': [],
}

let maleList = [];   // создаю массивы отдельно с мальчиками и отдельно с девочками
let femaleList = [];

sportsmenList.forEach( item => {    // выполняю сортировку общего списка спортсменов
  if (item.gender.toLowerCase() == 'м') {
    maleList.push(item);
  } else if (item.gender.toLowerCase() == 'ж') {
    femaleList.push(item);
  }
});

let categories = new Map(); // коллекция для хранения списка категорий с участниками

function checkSportsmen(sportsmenList, age1, age2, weight1, weight2, gender, array) {  //функция для проверки соответствия спортсмена категории

  for (let i = 0; i < sportsmenList.length; i ++) {
    let sportsmenAge = String(sportsmenList[i].age);

    // если совпадают пол, возраст, вес - спортсмен добавляется в категорию
    if(sportsmenList[i].gender.toLowerCase() == gender &&
      (sportsmenAge.split('-').includes(age1) || sportsmenAge.split('-').includes(age2)) &&
      (sportsmenList[i].weight <= weight2 && sportsmenList[i].weight > weight1)) array.push(sportsmenList[i]);
  }
}


function setCategories(listCategories, listSportsmen, gender, label) {  // функция для формирования списка категорий на основе массивов categoriesMale и categoriesFemale
  let listLength = Object.entries(listCategories).length;
  let keys = Object.keys(listCategories);
  let values = Object.values(listCategories);

  // начинаю перебор категори:
  for (let i = 0; i < listLength; i++) {   //1. Рассматриваю вначале возраста

    if (values[i].length == 0) {  //2. если в возрасте нет весовых категорий (4-5 лет), то всех спортсменов добавляю в один массив

      let array = [];
      checkSportsmen(listSportsmen, keys[i].split('-')[0], keys[i].split('-')[1], 0, 100, gender, array);  // 3.a Проверяю по списку соответствие спортсменов этой категории
      array.sort(sortByField('weight'));  //3.b
      categories.set(`${label} ${keys[i]} лет`, array);  // 4. Добавляю название категории и массив участников в коллекцию

    } else {

      for (let j = 0; j <= values[i].length; j++) {  // 5. Если есть градация по весам, то рассматриваю какждую весовую категорию

        let array = [];

        if (values[i][j-1] === undefined) values[i][j-1] = 0;  // 6. Это нужно, чтобы корректно подбиралась первая весовая категория, т.к. в ней вес предидущей (для диапазона) === undefined
        checkSportsmen(listSportsmen, keys[i].split('-')[0], keys[i].split('-')[1], values[i][j-1], values[i][j], gender, array);
        array.sort(sortByField('weight'));
        categories.set(`${label} ${keys[i]} лет до ${values[i][j]} кг`, array);

        if (j == values[i].length - 1) {  // 7. Когда мы дошли до последней границы весов, то формирую абсолютную категорию в возрасте
          let array = [];
          checkSportsmen(listSportsmen, keys[i].split('-')[0], keys[i].split('-')[1], values[i][j], 1000, gender, array);
          array.sort(sortByField('weight'));
          categories.set(`${label} ${keys[i]} лет свыше ${values[i][j]} кг`, array);
          break;
        }
      }
    }
  }
}

setCategories(categoriesMale, maleList, 'м', 'мальчики');
setCategories(categoriesFemale, femaleList, 'ж', 'девочки');

categories.forEach( (value, key, map) => {  // удаляю категории, в которых нет людей
  if (value.length == 0) map.delete(key);
})

let categoriesWrapper = document.querySelector('.consolidate__categories');
let counterDetails = 0;




// =======================  add custom categories  ==========================
categories.set('31 items', generateArray(31));
categories.set('30 items', generateArray(30));
categories.set('29 items', generateArray(29));
categories.set('28 items', generateArray(28));
categories.set('27 items', generateArray(27));
categories.set('26 items', generateArray(26));
categories.set('25 items', generateArray(25));
categories.set('24 items', generateArray(24));
categories.set('23 items', generateArray(23));
categories.set('22 items', generateArray(22));
categories.set('21 items', generateArray(21));
categories.set('20 items', generateArray(20));
categories.set('19 items', generateArray(19));
categories.set('18 items', generateArray(18));
categories.set('17 items', generateArray(17));
categories.set('16 items', generateArray(16));
categories.set('15 items', generateArray(15));
categories.set('14 items', generateArray(14));
categories.set('13 items', generateArray(13));
categories.set('12 items', generateArray(12));
categories.set('11 items', generateArray(11));
categories.set('10 items', generateArray(10));
categories.set('9 items', generateArray(9));
categories.set('8 items', generateArray(8));
categories.set('7 items', generateArray(7));
categories.set('6 items', generateArray(6));
categories.set('5 items', generateArray(5));
categories.set('4 items', generateArray(4));
categories.set('3 items', generateArray(3));
categories.set('2 items', generateArray(2));


// =======================  add custom categories  ==========================


categories.forEach( (value, key, map) => {                                      // составляю список категорий с участниками (summary)
  // создаю заголовок раскрывающегося summary и вставляю название категории

  categoriesWrapper.insertAdjacentHTML('beforeend',
  `<details class="consolidate__details details${counterDetails}">
    <summary class="consolidate__summary">${key}</summary>

  </details>`);

  let content = document.createElement('table');        // для каждой категории создаю таблицу
  document.querySelector(`.details${counterDetails}`).insertAdjacentElement('beforeend', content);  // вставляю её как контент details

  content.classList.add('consolidate__table');    // добавляю необходимые классы для стилизации
  content.classList.add('details__table');
  content.classList.add(`details__table${counterDetails}`)
  content.innerHTML = '<tbody></tbody>';
  // в каждую таблицу вставляю общий tablehead, для этого его нужно клонировать
  document.querySelector(`.details__table${counterDetails}`).querySelector('tbody').insertAdjacentElement('beforeend', tableHead.cloneNode(true));

  for (let i = 0; i < value.length; i++) {      // в зависимости от количества участников в категории заполняю таблицу
    let [lastName, name] = value[i].fullName.split(" ");

    content.querySelector('tbody').insertAdjacentHTML('beforeend',
    `<tr class="consolidate__row details__row">
      <td class="consolidate__cell consolidate__cell_center details__cell">${i+1}</td>
      <td class="consolidate__cell details__cell">${lastName}</td>
      <td class="consolidate__cell details__cell">${name}</td>
      <td class="consolidate__cell consolidate__cell_center details__cell">${value[i].age}</td>
      <td class="consolidate__cell consolidate__cell_center details__cell">${value[i].weight}</td>
      <td class="consolidate__cell consolidate__cell_center details__cell">${value[i].ku}</td>
      <td class="consolidate__cell consolidate__cell_center details__cell">${value[i].gender.toLowerCase()}</td>
      <td class="consolidate__cell consolidate__cell_center details__cell">${value[i].city}</td>
      <td class="consolidate__cell details__cell">${value[i].coach}</td>
    </tr>`);
  }

  counterDetails++;

});

let detailsTableList = Array.from(document.querySelectorAll('.details__table'));
detailsTableList = detailsTableList.map( item => item = item.innerHTML);

function generateArray(value) {
  let array = [];

  for (let i = 0; i < value; i++) {
    let obj = {};
    obj.fullName = `${i} ${i}`;
    obj.gender = `${i}`;
    obj.age = i;
    obj.weight = i;
    obj.city = i;
    obj.coach = i;

    array.push(obj);
  }

  return array;
}



localStorage.setItem('detailsList', JSON.stringify(detailsTableList));
localStorage.setItem('categories', JSON.stringify(Array.from(categories.entries())));

//======================= Sort ======================
const fieldsList = ['fullName', 'age', 'coach'];

function sortByField(field) {
  return (a, b) => a[field] > b[field] ? 1 : -1;
}

function sortByFieldReverse(field) {
  return (a, b) => b[field] > a[field] ? 1 : -1;
}







//======================= Animation ======================

class Accordion {
  constructor(el) {
    // Store the <details> element
    this.el = el;
    // Store the <summary> element
    this.summary = el.querySelector('summary');
    // Store the <div class="content"> element
    this.content = el.querySelector('.consolidate__table');

    // Store the animation object (so we can cancel it if needed)
    this.animation = null;
    // Store if the element is closing
    this.isClosing = false;
    // Store if the element is expanding
    this.isExpanding = false;
    // Detect user clicks on the summary element
    this.summary.addEventListener('click', (e) => this.onClick(e));
  }

  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault();
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = 'hidden';
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.el.open) {
      this.open();
    // Check if the element is being openned or is already open
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  shrink() {
    // Set the element as "being closed"
    this.isClosing = true;

    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the height of the summary
    const endHeight = `${this.summary.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [startHeight, endHeight]
    }, {
      duration: 400,
      easing: 'ease-out'
    });

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false);
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => this.isClosing = false;
  }

  open() {
    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.el.open = true;
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [startHeight, endHeight]
    }, {
      duration: 400,
      easing: 'ease-out'
    });
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true);
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => this.isExpanding = false;
  }

  onAnimationFinish(open) {
    // Set the open attribute based on the parameter
    this.el.open = open;
    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = '';
  }
}

document.querySelectorAll('details').forEach((el) => {
  new Accordion(el);
});
