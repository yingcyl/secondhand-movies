import React from "react";
import axios from "axios";
import MovieList from "./MovieList";
import SearchBar from "./SearchBar";
import Basket from "./Basket";
import Filter from "./Filter";

class App extends React.Component {
  state = {
    movies: [],
    genres: {},
    stock: {},
    prices: {},
    cart: [],
  };

  onAddToCart = (movie) => {
    const currentStock = this.state.stock[movie.id];

    if (currentStock > 0) {
      const updatedStock = this.state.stock[movie.id] - 1;
      this.setState(
        {
          stock: { ...this.state.stock, ...{ [movie.id]: updatedStock } },
          cart: [...this.state.cart, movie],
        },
        () => {
          console.log(this.state.cart);
        }
      );
    }
  };

  getMoviePrice = (movie) => {
    const movieDate = parseInt(movie.release_date.substring(0, 4));
    if (movieDate > 2000 && movieDate < 2015) {
      return "£5.99";
    } else if (movieDate >= 2015) {
      return "£6.99";
    } else if (movieDate > 1980 && movieDate <= 2000) {
      return "£4.99";
    } else if (movieDate > 1960 && movieDate <= 1980) {
      return "£3.99";
    } else if (movieDate > 1940 && movieDate <= 1960) {
      return "£2.99";
    } else {
      return "£2.59";
    }
  };

  getMovieStock = (movie) => {
    if (movie.id < 100000) {
      return 5;
    } else if (movie.id >= 100000 && movie.id < 200000) {
      return 3;
    } else if (movie.id >= 200000 && movie.id < 300000) {
      return 6;
    } else if (movie.id >= 300000 && movie.id < 400000) {
      return 2;
    } else if (movie.id >= 400000 && movie.id < 500000) {
      return 4;
    } else if (movie.id >= 600000 && movie.id < 700000) {
      return 2;
    } else if (movie.id >= 800000 && movie.id < 900000) {
      return 1;
    } else if (movie.id >= 900000 && movie.id < 1000000) {
      return 2;
    } else {
      return 6;
    }
  };

  onSearchInput = (term) => {
    console.log(term);

    const request1 = axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1&query=${term}`
    );
    const request2 = axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_API_KEY}`
    );

    axios.all([request1, request2]).then(
      axios.spread((...res) => {
        const res1 = res[0];
        const res2 = res[1];

        const genres = {};
        for (let i = 0; i < res2.data.genres.length; i++) {
          genres[res2.data.genres[i].id] = res2.data.genres[i].name;
        }

        const movies = res1.data.results;

        const stock = {};
        for (let i = 0; i < movies.length; i++) {
          stock[movies[i].id] = this.getMovieStock(movies[i]);
        }

        const prices = {};
        for (let i = 0; i < movies.length; i++) {
          prices[movies[i].id] = this.getMoviePrice(movies[i]);
        }

        this.setState(
          {
            movies: movies,
            genres: genres,
            stock: stock,
            prices: prices,
          },
          () => {
            console.log(
              this.state.movies,
              this.state.genres,
              this.state.stock,
              this.state.prices
            );
          }
        );
      })
    );
  };

  render() {
    return (
      <div>
        <div>
          <h1 className="site-header">Secondhand Movies</h1>
        </div>
        <SearchBar onSubmit={this.onSearchInput} />
        <Filter genres={this.state.genres} movies={this.state.movies} />
        <Basket prices={this.state.prices} cart={this.state.cart} />

        <MovieList
          movies={this.state.movies}
          genres={this.state.genres}
          stock={this.state.stock}
          prices={this.state.prices}
          onAddToCart={this.onAddToCart}
        />
      </div>
    );
  }
}

export default App;
