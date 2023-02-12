const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Movie methods

async function createUnwatchedMovieFromRequestBody(body) {
  if (!body.hasOwnProperty("franchise")) {
    body.franchise = undefined;
  }

  if (!body.hasOwnProperty("chronological")) {
    body.chronological = undefined;
  }

  if (!body.hasOwnProperty("release")) {
    body.release = undefined;
  }

  return await createUnwatchedMovie({ title: body.title, genres: body.genres, year: body.year, runTime: body.runTime, 
    franchise: body.franchise, chronological: body.chronological, release: body.release, poster: body.poster });
}

async function createUnwatchedMovie({ title, genres, year, runTime, franchise, chronological, release, poster }) {
  try {
    var movie = {
      parent: {
        database_id: process.env.NOTION_MOVIE_DATABASE_ID
      },
      properties: {
        [process.env.MOVIE_WATCHED_ID]: {
          checkbox: false
        },
        [process.env.MOVIE_TITLE_ID]: {
          title: [
            {
              type: 'text',
              text: {
                content: title
              }
            }
          ]
        },
        [process.env.MOVIE_GENRE_ID]: {
          multi_select: genres.map(genre => {
            return { name: genre.name };
          })
        },
        [process.env.MOVIE_YEAR_ID]: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: year
              }
            }
          ]
        },
        [process.env.MOVIE_RUN_TIME_ID]: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: runTime
              }
            }
          ]
        },
        [process.env.MOVIE_POSTER_ID]: {
          files: [
            {
              type: 'external',
              name: title + ' poster',
              external: {
                url: poster
              }
            }
          ] 
        }
      }
    };
    
    if (franchise) {
      movie.properties[process.env.MOVIE_FRANCHISE_ID] = {
        select: {
          name: franchise.name
        }
      };
    } else {
      movie.properties[process.env.MOVIE_FRANCHISE_ID] = {
        select: {
          name: 'None'
        }
      }
    }

    if (chronological || chronological === 0) {
      movie.properties[process.env.MOVIE_CHRONOLOGICAL_ID] = {
        number: chronological
      }
    }

    if (release || release === 0) {
      movie.properties[process.env.MOVIE_RELEASE_ID] = {
        number: release
      }
    }
  } catch (e) {
    console.log(e.message);
    return false;
  }

  try {
    await notion.pages.create(movie);
    return true;
  } catch (e) {
    console.log(e.message);
    return { result: false, error_message: e.message };
  }
}

async function createWatchedMovieFromRequestBody(body) {
  if (!body.hasOwnProperty("scareFactor")) {
    body.scareFactor = undefined;
  }

  if (!body.hasOwnProperty("franchise")) {
    body.franchise = undefined;
  }

  if (!body.hasOwnProperty("chronological")) {
    body.chronological = undefined;
  }

  if (!body.hasOwnProperty("release")) {
    body.release = undefined;
  }

  return await createWatchedMovie({ title: body.title, genres: body.genres, year: body.year, 
    runTime: body.runTime, rewatch: body.rewatch, rating: body.rating, scareFactor: body.scareFactor,
    franchise: body.franchise, chronological: body.chronological, release: body.release, poster: body.poster });
}

async function createWatchedMovie({ title, genres, year, runTime, rewatch, rating, scareFactor, franchise, chronological, release, poster }) {
  try {
    var movie = {
      parent: {
        database_id: process.env.NOTION_MOVIE_DATABASE_ID
      },
      properties: {
        [process.env.MOVIE_WATCHED_ID]: {
          checkbox: true
        },
        [process.env.MOVIE_TITLE_ID]: {
          title: [
            {
              type: 'text',
              text: {
                content: title
              }
            }
          ]
        },
        [process.env.MOVIE_GENRE_ID]: {
          multi_select: genres.map(genre => {
            return { name: genre.name };
          })
        },
        [process.env.MOVIE_YEAR_ID]: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: year
              }
            }
          ]
        },
        [process.env.MOVIE_RUN_TIME_ID]: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: runTime
              }
            }
          ]
        },
        [process.env.MOVIE_REWATCH_ID]: {
          checkbox: rewatch
        },
        [process.env.MOVIE_RATING_ID]: {
          select: {
            id: rating.id
          }
        },
        [process.env.MOVIE_POSTER_ID]: {
          files: [
            {
              type: 'external',
              name: title + ' poster',
              external: {
                url: poster
              }
            }
          ] 
        }
      }
    }

    if (scareFactor) {
      movie.properties[process.env.MOVIE_SCARE_FACTOR_ID] = {
        select: {
          id: scareFactor.id
        }
      };
    }

    if (franchise) {
      movie.properties[process.env.MOVIE_FRANCHISE_ID] = {
        select: {
          name: franchise.name
        }
      };
    } else {
      movie.properties[process.env.MOVIE_FRANCHISE_ID] = {
        select: {
          name: 'None'
        }
      }
    }

    if (chronological || chronological === 0) {
      movie.properties[process.env.MOVIE_CHRONOLOGICAL_ID] = {
        number: chronological
      }
    }

    if (release || release === 0) {
      movie.properties[process.env.MOVIE_RELEASE_ID] = {
        number: release
      }
    }
  } catch (e) {
    console.log(e.message);
    return false;
  }
  
  try {
    await notion.pages.create(movie);
    return true;
  } catch (e) {
    console.log(e.message);
    return { result: false, error_message: e.message };
  }
}

async function getAllMovieSelectOptions() {
  const database = await notion.databases.retrieve({ database_id: process.env.NOTION_MOVIE_DATABASE_ID })

  return {
    genres: notionPropertiesById(database.properties)[process.env.MOVIE_GENRE_ID].multi_select.options.map(option => {
      return { id: option.id, name: option.name };
    }),
    ratings: notionPropertiesById(database.properties)[process.env.MOVIE_RATING_ID].select.options.map(option => {
      return { id: option.id, name: option.name };
    }),
    scareFactors: notionPropertiesById(database.properties)[process.env.MOVIE_SCARE_FACTOR_ID].select.options.map(option => {
      return { id: option.id, name: option.name };
    }),
    franchises: notionPropertiesById(database.properties)[process.env.MOVIE_FRANCHISE_ID].select.options.map(option => {
      return { id: option.id, name: option.name };
    })
  }
}

function notionPropertiesById(properties) {
  return Object.values(properties).reduce((obj, property) => {
    const { id, ...rest } = property;
    return { ...obj, [id]: rest };
  }, {});
}

// TV Show methods

async function getAllTVShowSelectOptions() {
  const database = await notion.databases.retrieve({ database_id: process.env.NOTION_MOVIE_DATABASE_ID })

  return {
    genres: notionPropertiesById(database.properties)[process.env.MOVIE_GENRE_ID].multi_select.options.map(option => {
      return { id: option.id, name: option.name };
    }),
    ratings: notionPropertiesById(database.properties)[process.env.MOVIE_RATING_ID].select.options.map(option => {
      return { id: option.id, name: option.name };
    }),
    scareFactors: notionPropertiesById(database.properties)[process.env.MOVIE_SCARE_FACTOR_ID].select.options.map(option => {
      return { id: option.id, name: option.name };
    }),
    franchises: notionPropertiesById(database.properties)[process.env.MOVIE_FRANCHISE_ID].select.options.map(option => {
      return { id: option.id, name: option.name };
    })
  }
}

module.exports = {
  createUnwatchedMovieFromRequestBody,
  createWatchedMovieFromRequestBody,
  getAllMovieSelectOptions
}