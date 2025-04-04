import Routes from './routes/route'

const App = () => {
  return (
    <div className="w-full h-screen flex items-start justify-center md:py-12 py-6 md:px-0 px-6">
      <div className="md:w-[60rem] w-full">
        <Routes />
      </div>
    </div>
  )
}

export default App