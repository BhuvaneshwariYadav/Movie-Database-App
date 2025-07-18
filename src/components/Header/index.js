import {useState, useEffect} from 'react'

import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {IoIosSearch} from 'react-icons/io'

import './index.css'
import MovieCard from '../MovieCard'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
const API_KEY = '3789dd104d0828c59818a535cd5278b0'
const Header = () => {
  const [isSowMenu, setToggle] = useState(false)
  const [searchChars, setSearchChars] = useState('')
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.inProgress,
    data: [],
  })

  useEffect(() => {
    const getSearchList = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searchChars}&page=1`,
        )
        const dataResponse = await response.json()
        const updatedData = dataResponse.results.map(each => ({
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

        setApiResponse(prevStatus => ({
          ...prevStatus,
          status: apiStatusConstants.success,
          data: updatedData,
        }))
      } catch (error) {
        setApiResponse(prev => ({...prev, status: apiStatusConstants.failure}))
      }
    }
    getSearchList()
  }, [searchChars])

  const toggleMenuBtn = () => {
    setToggle(prev => !prev)
  }
  const onChangeInput = event => {
    setSearchChars(event.target.value)
  }

  const {data, status} = apiResponse

  const renderSuccessView = () => (
    <div className="search-movies-container movies-container">
      <h1 className="heading">Search Result</h1>
      <ul className="movies-list-container">
        {data.map(each => (
          <MovieCard
            isSearchResult
            key={`details${each.id}`}
            movieDetails={each}
          />
        ))}
      </ul>
    </div>
  )
  const renderLoader = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )
  const renderDiffrentViews = () => {
    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoader()
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return <h1 className="failure-mesg">Error</h1>
      default:
        return null
    }
  }

  return (
    <>
      <nav className="nav-bar">
        <Link to="/" className="link">
          <h1 className="logo-name">
            Prime <span className="logo-high">Show</span>
          </h1>
        </Link>
        <div className="search-div">
          <input
            className="search-input"
            onChange={onChangeInput}
            type="search"
            placeholder="Search"
          />
          <IoIosSearch className="search-icon" />
        </div>
        <div>
          <Link to="/" className="link">
            <h1 className="item-lg">Popular</h1>
          </Link>
          <Link to="/top-rated" className="link">
            <h1 className="item-lg">Top Rated</h1>
          </Link>
          <Link to="/upcoming" className="link">
            <h1 className="item-lg">Upcoming</h1>
          </Link>
        </div>
      </nav>
      {data.length >= 1 ? renderDiffrentViews() : ''}
    </>
  )
}

export default Header
