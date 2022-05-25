let localCategories = new Map(JSON.parse(localStorage.getItem('categories')));
let localDetailsTableList = Array.from(JSON.parse(localStorage.getItem('detailsList')));

const pullSelect = document.querySelector('.pull__categoriesList');
const pullInfo = document.querySelector('.pull__info');

let localCategoriesCount = 0;
localCategories.forEach((value, key, map) => {
  let option = document.createElement('option');   // переменная для создания элемента выпадающего списка
  let table = document.createElement('table');     // переменная для создания таблицы для каждой категории

  option.classList.add('pull__option');             //  добавление класса к меню из списка
  option.textContent = key;                         //  даю название элементу меню в соответствии с названием категории
  option.value = `pull__table_${localCategoriesCount}`;   //  присваю порядковый номер пункту меню в для сопоставления с таблицами

  table.classList.add('pull__table');               // добавляю класс таблице
  table.classList.add(`pull__table_${localCategoriesCount}`);   //  добавляю порядковый номер таблице
  table.classList.add('pull__table_hide');          //  прячу все таблицы
  table.insertAdjacentHTML("beforeend", localDetailsTableList[localCategoriesCount])   // заполняю таблицы данными из сводной

  pullSelect.insertAdjacentElement('beforeend', option);    //  добавляю пункты в выпадающее меню
  pullInfo.insertAdjacentElement("beforeend", table);       //  добавляю таблицу

  localCategoriesCount++;                           // увеличиваю счетчик
});

let pullOptionList = document.querySelectorAll('.pull__option');
const tableList = document.querySelectorAll('.pull__table');

let currentPull; // переменная для отображаемой пули участников

let currentFighterAreas = []; // массив для хранения отображаемых полей в пуле
let currentCatShow; // переменная для хранения названия текущей переменной

let currentCategoriesIndex; // переменная для хранения индекса (названия категории)
let currentCategories; // переменная для хранения массива участников текущей категории



const pullFighterList = Array.from(document.getElementsByClassName('pull__fighter'));  //  массив с полями пулл-листа
const pullDrawGrid = Array.from(document.querySelectorAll('.pull__draw_grid'));   // массив с блоком нумерации боя
const rightGridList = Array.from(document.querySelectorAll('.pull__draw_right')); // массив с правой частью сетки
const rightParticipiantsList = document.querySelector('.participiantsList_right'); // блок с бойцами в правой части сетки
const leftParticipiantsList = document.querySelector('.participiantsList_left'); // блок с бойцами в левой части сетки
const pullContentWrapper = document.querySelector('.pull__content-wrapper'); // элемент для отображения пули
const leftPairList = Array.from(leftParticipiantsList.querySelectorAll('.pull__content_item')); // массив с парами бойцов с левой стороны
const pullDraw16 = document.querySelector('.pull__draw_16');  // переменная для хранения блока сетка 1/16 финала
const pullDraw8 = document.querySelector('.pull__draw_8');
const pullDraw4 = document.querySelector('.pull__draw_4');
const pullDraw2 = document.querySelector('.pull__draw_2');

let fighterNumber = 0; // переменная для нумерации полей бойцов в пули


function resetCurrentFighterAreas() {
  // обнуляю массив с актуальными полями отображения бойцов
  for (let i = currentFighterAreas.length - 1; i >= 0; i--) {
    currentFighterAreas.splice(i);
  }
}

function makeCurrentFighterAreas() {
  for (let area of pullFighterList) {
    if (!area.classList.contains('pull__fighter_hide')) currentFighterAreas.push(area);
  }
}



function showCurrentShuffledFighters(currentCat) {
  let current;

  if (!shuffleCategories.get(currentCat)) {
    console.log('Error')
    return;
  } else {

    for ([key, value] of shuffleCategories.entries()) {
      if (key == currentCat) current = value;
    }

    for(let i = 0; i <= currentFighterAreas.length; i++) {
      if (current[i]) currentFighterAreas[i].textContent = current[i].fullName;
    }
  }
}


function checkPullTableList() {                            // функция для отображения актуальной таблицы
  for (let i = 0; i < pullOptionList.length; i++) {

    if (!tableList[i].classList.contains('pull__table_hide')) {
      tableList[i].classList.add('pull__table_hide');
      if (tableList[i].classList.contains('pull__table_current')) tableList[i].classList.remove('pull__table_current');
    }

    if (pullOptionList[i].selected == true) {
      tableList[i].classList.remove('pull__table_hide');
      tableList[i].classList.add('pull__table_current');

      for (let [cat, participants] of localCategories.entries()) {

        if (cat == pullOptionList[i].textContent) {   // присваиваю переменной currentPull значение, равное количетву людей в выбранной категории
          currentPull = participants.length;
          currentCatShow = cat;
        }
      }
    }

  }

  checkCurrentPull();
  showCurrentShuffledFighters(currentCatShow);
}


/* ===================== Изменение пули под количество участников ============================ */


function checkCurrentPull() {       // функция для проверки и изменения вида сетки
  let diff = pullFighterList.length - currentPull;    // переменная для хранения разницы между максимальныи количеством участников (32) и текущим количеством участников
  let halfDiff = pullFighterList.length / 2 - currentPull;
  let quaterDiff = leftPairList.length - currentPull;

  for (let i = 0; i < pullFighterList.length; i++) {
    pullFighterList[i].textContent = '';
  }

  resetCurrentFighterAreas();

  for (let i = 0; i < pullFighterList.length; i++) {   // обнуляю стили бойцов, чтобы корректно прорисовывалась страница для каждой категории
    if (pullFighterList[i].classList.contains('pull__fighter_hide')) pullFighterList[i].classList.remove('pull__fighter_hide');
    if (pullFighterList[i].classList.contains('pull__fighter_shift')) pullFighterList[i].classList.remove('pull__fighter_shift');
  }

  for (let i = 0; i < pullDrawGrid.length; i++) {   // обнуляю стили сетки с нумерацией боя, чтобы корректно прорисовывалась страница для каждой категории
    if (pullDrawGrid[i].classList.contains('draw__grid_single')) pullDrawGrid[i].classList.remove('draw__grid_single');
  }

  rightGridList.forEach(item => {  // обнуляю стили для правой части сетки
    if (item.classList.contains('draw__right_hide')) item.classList.remove('draw__right_hide');
  })

  //обнуляю визуал сетки бойцов
  if (pullContentWrapper.classList.contains('pull__content-wrapper_small')) pullContentWrapper.classList.remove('pull__content-wrapper_small');
  if (pullContentWrapper.classList.contains('pull__content-wrapper_verysmall')) pullContentWrapper.classList.remove('pull__content-wrapper_verysmall');
  if (pullDraw16.classList.contains('pull__draw_hide')) pullDraw16.classList.remove('pull__draw_hide');


  //обнуляю визуал правого юлока с  бойцами
  if (rightParticipiantsList.classList.contains('participiantsList_right_hide')) rightParticipiantsList.classList.remove('participiantsList_right_hide');

  // обнуляю стили для пар бойцов при количестве участников > 8
  for (let item of leftPairList) {
    if (item.classList.contains('pull__pair_hide')) item.classList.remove('pull__pair_hide');
    if (item.classList.contains('pull__pair_shift')) item.classList.remove('pull__pair_shift');
  }

  pullDraw8.querySelectorAll('.pull__draw_grid').forEach(item => {
    if (item.classList.contains('draw__grid_quater')) item.classList.remove('draw__grid_quater');
  })








  if (currentPull >= 16 && !(currentPull % 2)) {    // измения сетку для четного количества спортсменов от 32 до 16

    for (let i = 0; i < pullFighterList.length; i += 2) { // изменяю отображение бойцов в зависимости от количества участников
      if (i < (diff) || (i >= (pullFighterList.length / 2) && i < (pullFighterList.length / 2 + (diff)))) {
        pullFighterList[i].classList.add('pull__fighter_hide');
        pullFighterList[i+1].dataset.check = 'check'; // добавляю data свойство. Если оно есть, то поле получило номер для расчета пули
        pullFighterList[i+1].classList.add(`fighter__${fighterNumber}`); // добавляю класс с номером поля
        fighterNumber += 1; // увеличиваю нумерацию на 1
      }
    }

    // изменяю отображение поля с номером поединка в зависимости от количества участников
    for (let i = 0; i < pullDrawGrid.length; i++) { // 22 - порядковый номер поля сетки первой пары бойцов с правой стороны
      if ((i < diff / 2) || ((i >= 22) && (i < 22 + (diff / 2)))) pullDrawGrid[i].classList.add('draw__grid_single');
    }

    for (let fighter of pullFighterList) { // цикл для нумерации оставшихся полей
      if (fighter.dataset.check != 'check' && !fighter.classList.contains('pull__fighter_hide')) {
        fighter.classList.add(`fighter__${fighterNumber}`); // добавляю класс с номером поля
        fighter.dataset.check = 'check';  // добавляю аттрибут, что поле проверено
        fighterNumber++;  // увеличиваю на один
      }
    }


  } else if (currentPull >= 16 && (currentPull % 2)) {

    for (let i = 0; i < pullFighterList.length; i++) { // изменяю отображение бойцов в зависимости от количества участников
      if (i <= (diff) || (i >= (pullFighterList.length / 2) && i < (pullFighterList.length / 2 + (diff)))) {
        if (pullFighterList[i].classList.contains('fighter_even')) pullFighterList[i].classList.add('pull__fighter_hide');
      }
    }

    for (let i = 0; i < pullDrawGrid.length; i++) { // 22 - порядковый номер поля сетки пары бойцов
      if ((i < diff / 2) || ((i >= 22) && (i < 22 + (diff / 2) - 1))) pullDrawGrid[i].classList.add('draw__grid_single');
    }

  } else if (currentPull < 16) {  // если участников меньше 16

    if (currentPull <= 8) {
      pullContentWrapper.classList.add('pull__content-wrapper_verysmall');
      pullDraw16.classList.add('pull__draw_hide');
    }

    rightGridList.forEach(item => item.classList.add('draw__right_hide')); // скрываю всю правую часть сетки

    for (let i = pullFighterList.length - 1; i >= pullFighterList.length / 2; i--) {  //  скрываю бойцов из правой сетки
      pullFighterList[i].classList.add('pull__fighter_hide');
    }

    rightParticipiantsList.classList.add('participiantsList_right_hide');  // скрываю правый блок с бойцами

    pullContentWrapper.classList.add('pull__content-wrapper_small'); // измения визуал сетки бойцов

    for (let i = 0; i < halfDiff; i++) {
      for (j = 0; j < halfDiff + 3; j += 4) {
        if (leftPairList[j]) leftPairList[j].querySelector('.fighter_odd').classList.add('pull__fighter_hide'); // выбираю пару по порядку и убираю из нее одного бойца
        if (j != 8) pullDrawGrid[j].classList.add('draw__grid_single'); // скрываю лишнюю сетку с нумерацией боя
      }

      if (i > 1) {
        for (j = 0; j < halfDiff + 3; j += 2) {
          if (leftPairList[j]) leftPairList[j].querySelector('.fighter_odd').classList.add('pull__fighter_hide'); // выбираю пару по порядку и убираю из нее одного бойца
          if (j != 8 && j != 10) pullDrawGrid[j].classList.add('draw__grid_single'); // скрываю лишнюю сетку с нумерацией боя
        }
      }

      if (i > 3) {
        for (j = 1; j < halfDiff; j += 4) {
          if (leftPairList[j]) leftPairList[j].querySelector('.fighter_odd').classList.add('pull__fighter_hide'); // выбираю пару по порядку и убираю из нее одного бойца
          pullDrawGrid[j].classList.add('draw__grid_single'); // скрываю лишнюю сетку с нумерацией боя
        }
      }

      if (i > 5) {
        for (j = 3; j < halfDiff; j += 4) {
          if (leftPairList[j]) leftPairList[j].querySelector('.fighter_odd').classList.add('pull__fighter_hide'); // выбираю пару по порядку и убираю из нее одного бойца
          pullDrawGrid[j].classList.add('draw__grid_single'); // скрываю лишнюю сетку с нумерацией боя
        }
      }

      if (i > 7) {
        for (let j = 0; j < halfDiff - 5; j += 4) {
          if (leftPairList[j]) {
            leftPairList[j].querySelector('.fighter_odd').classList.add('pull__fighter_hide');
            leftPairList[j].querySelector('.fighter_even').classList.add('pull__fighter_hide');
            pullDraw8.querySelectorAll('.pull__draw_grid')[0].classList.add('draw__grid_single');
            leftPairList[1].classList.add('pull__pair_shift');
            //pullDraw4.querySelectorAll('.pull__draw_grid')[0].classList.add('draw__grid_single');

            if (j == 4) {
              pullDraw8.querySelectorAll('.pull__draw_grid')[1].classList.remove('draw__grid_single');
              pullDraw8.querySelectorAll('.pull__draw_grid')[2].classList.add('draw__grid_quater');
              pullDraw8.querySelectorAll('.pull__draw_grid')[2].classList.add('draw__grid_single');
              pullDraw4.querySelectorAll('.pull__draw_grid')[0].classList.remove('draw__grid_single');
              leftPairList[j + 1].classList.add('pull__pair_shift');
            }
          }
        }

        for (let j = 2; j < halfDiff - 5; j += 4) {
          console.log(j, i);
          if (i > 9) {
            leftPairList[j].querySelector('.fighter_even').classList.add('pull__fighter_hide');
            pullDraw8.querySelectorAll('.pull__draw_grid')[1].classList.add('draw__grid_single');
            leftPairList[j + 1].classList.add('pull__pair_shift');
          }

          if (i > 10) {
            pullDraw2.querySelector('.pull__draw_grid').classList.remove('draw__grid_single');
          }
        }

      }

    }
  }

  makeCurrentFighterAreas();
}





window.addEventListener('DOMContentLoaded', checkPullTableList);  //  отображаю таблицу при загрузке страницы
for (let i = 0; i < pullOptionList.length; i++) {
  pullSelect.addEventListener('click', checkPullTableList);  //  добавляю отображение таблиц при выборе категории
};



// ========================  Функция для распределения бойцов ========================= //

let shuffleCategories = new Map();  // коллекция для хранения расчитанных категорий
const suffleCurrentButton = document.querySelector('.suffle__current');
const suffleAllButton = document.querySelector('.suffle__all');



 // тасование Фишера-Йетса
 function shuffle(array) {
  let coachList = new Set(); // создаю коллекцию тренеров в данной категории
  let listByCoach = new Map(); // коллекция для хранения массивов участников по тренерам


  for (let item of array) { // сканирую список участникови добавляю тренеров
    coachList.add(item.coach);
  }

  for (let coach of coachList) { // составляю коллекцию из тренеров и пустых массивов
    listByCoach.set(coach, []);
  }

  for (let sportsman of array) { // заполняю коллекцию спортсменами
    for (let [coach, team] of listByCoach.entries()) {
      if (sportsman.coach == coach) team.push(sportsman);
    }
  }

  resetCurrentFighterAreas();

  makeCurrentFighterAreas();

  for (let area of pullFighterList) {
    //if ()
  }

  console.log(currentFighterAreas)

  console.log(listByCoach);



  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  /*
  for (let i = 0; i < array.length; i++) {
    currentFighterAreas[i].textContent = array[i].fullName;
  }
  */
  console.log(array);

  shuffleCategories.set(currentCategoriesIndex, array);
}

function makeDrawList(categories) {


  // ищу выбранную категорию и присваиваю переменной значение
  for (let i = 0; i < pullOptionList.length; i++) {
    if (pullOptionList[i].selected) currentCategoriesIndex = pullOptionList[i].textContent;
  }

  // ищу в коллекции значение по ключу (названии категории)
  currentCategories = categories.get(currentCategoriesIndex);

  shuffle(currentCategories);
}


suffleCurrentButton.addEventListener('click', () => {
  makeDrawList(localCategories);
  showCurrentShuffledFighters(currentCatShow);
});
suffleAllButton.addEventListener('click', () => {
  for (let cat of localCategories.keys()) {
    currentCategoriesIndex = cat;
    currentCategories = localCategories.get(cat);
    shuffle(currentCategories);
  };

  resetCurrentFighterAreas();
  makeCurrentFighterAreas();
  showCurrentShuffledFighters(currentCatShow);
})
