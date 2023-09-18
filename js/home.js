import { ENDPOINT, LIMIT } from "./const.js";
import customFetch from "./fetch.js";

let mainRow = document.querySelector( ".hero-row" );
let cardImage = document.querySelector( ".user-image" );
let pagination = document.querySelector( ".pagination" );
let searchInput = document.querySelector( ".header-search" );

let search = "";
let activePage = 1;

async function getData() {
  try {
    let params = {
      q: search,
      _page: activePage,
      _limit: LIMIT,
    };
    const query = new URLSearchParams( params );

    mainRow.innerHTML = "Loading...";

    const users = await customFetch( `${ENDPOINT}users?${query.toString()}` );

    let pages = Math.ceil( users.length / LIMIT );

    if ( pages ) {
      pagination.innerHTML = `
        <li class="page-item ${activePage === 1 ? "disabled" : ""}">
          <button page="-" class="page-link">Previous</button>
        </li>
      `;
      for ( let i = 1; i <= pages; i++ ) {
        pagination.innerHTML += `
          <li class="page-item ${i === activePage ? "active" : ""}">
            <button page="${i}" class="page-link">${i}</button>
          </li>
        `;
      }

      pagination.innerHTML += `
        <li class="page-item ${activePage === pages ? "disabled" : ""}">
          <button page="+" class="page-link">Next</button>
        </li>
      `;
    } else {
      pagination.innerHTML = "";
    }

    mainRow.innerHTML = "";
    if ( users.length ) {
      users.map( ( el ) => {
        mainRow.innerHTML += `
          <div class="github-card">
            <div onclick="imagesFunction(${el.id})" class="user-image">
              <img src="${el.avatar_url}" alt="an img">
            </div>
            <h3 class="user-name">${el.login}</h3>
            <a href="#" class="user-username">@${el.login}.github.com</a>
            <p class="user-info">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, rerum.</p>
            <div class="user-followings">
              <div class="user-followings-subcards">
                <span>${el.followers_url.length}</span>
                <p>Followers</p>
              </div>
              <div class="user-followings-subcards">
                <span>${el.following_url.length}</span>
                <p>Following</p>
              </div>
            </div>
          </div>
        `;
      } );
    } else {
      mainRow.innerHTML = "No posts";
    }
  } catch ( err ) {
    alert( err );
  }
}

function handlePaginationClick( event ) {
  const button = event.target;
  const page = button.getAttribute( "page" );
  if ( page === "+" ) {
    activePage++;
  } else if ( page === "-" ) {
    activePage--;
  } else {
    activePage = parseInt( page );
  }
  getData();
}
function handleSearchInputChange( event ) {
  search = event.target.value;
  getData();
}


pagination.addEventListener( "click", handlePaginationClick );
searchInput.addEventListener( "input", handleSearchInputChange );

getData();
