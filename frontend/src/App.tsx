import Routes from './routes/route'

const App = () => {
  return (
    <div className="w-full h-screen flex items-start justify-center md:py-12 py-6 xl:px-0 px-6">
      <div className="xl:w-[60rem] w-full">
        <Routes />
      </div>
    </div>
  )
}

export default App