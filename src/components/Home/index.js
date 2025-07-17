import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './index.css'

import Header from '../Header'

import MovieCard from '../MovieCard'

const diffStates = {
  inProgress: 'LOADING',
  success: 'SUCCESS',
  fail: 'FAILURE',
}
class Home extends Component {
  state = {
    status: diffStates.inProgress,
    movieData: [],
    pageNo: 1,
  }

  componentDidMount = () => {
    this.getMovieData()
  }

  getMovieData = async () => {
    const {pageNo} = this.state
    const API_KEY = '76a3b00b83c8438422c7b7eb425b0645'
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNo}`,
      )
      const data = await response.json()
      const updatedData = data.results.map(each => ({
        adult: each.adult,
        backdropPath: each.backdrop_path,
        genreIds: each.genre_ids,
        id: each.id,
        originalLanguage: each.original_language,
        originalTitle: each.original_title,
        overview: each.overview,
        popularity: each.popularity,
        posterPath: each.poster_path,
        releaseDate: each.release_date,
        title: each.title,
        video: each.video,
        voteAverage: each.vote_average,
        voteCount: each.vote_count,
      }))

      this.setState({status: diffStates.success, movieData: updatedData})
    } catch (error) {
      this.setState({status: diffStates.fail})
    }
  }

  renderSuccessView = () => {
    const {movieData, pageNo} = this.state
    // console.log(movieData)
    return (
      <div className="movies-container">
        <h1 className="heading">Popular Movies</h1>
        <ul className="movies-list-container">
          {movieData.map(each => (
            <MovieCard key={`details${each.id}`} movieDetails={each} />
          ))}
        </ul>
        <div className="pagination-div">
          <button
            type="button"
            onClick={this.onClickPrev}
            className="paginations-btn prev-btn"
          >
            Prev
          </button>
          <p className="page-num">{pageNo}</p>
          <button
            type="button"
            onClick={this.onClickNxt}
            className="paginations-btn nxt-btn"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderDiffrentViews = () => {
    const {status} = this.state
    switch (status) {
      case diffStates.inProgress:
        return this.renderLoader()
      case diffStates.success:
        return this.renderSuccessView()
      case diffStates.fail:
        return <h1 className="failure-mesg">Error</h1>
      default:
        return null
    }
  }

  onClickNxt = () => {
    this.setState(
      prev => ({pageNo: prev.pageNo + 1, status: diffStates.inProgress}),
      this.getMovieData,
    )
  }

  onClickPrev = () => {
    const {pageNo} = this.state
    if (pageNo > 1) {
      this.setState(
        prev => ({pageNo: prev.pageNo - 1, status: diffStates.inProgress}),
        this.getMovieData,
      )
    }
  }

  render() {
    return (
      <div className="home-container">
        <Header />
        {this.renderDiffrentViews()}
      </div>
    )
  }
}

export default Home
