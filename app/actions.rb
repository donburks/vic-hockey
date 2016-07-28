# Homepage (Root path)
get '/' do
  erb :index
end

get '/players' do
  Player.all.to_json	
end

get '/players/:id' do
  Player.find(params[:id]).to_json
end

post '/players/create' do
  results = {result: false}
  player = Player.new number: params[:number], name: params[:name], position: params[:position]
  if player.save
    results[:result] = true
    results[:id] = player.id
  end

  results.to_json
end

get '/search/:txt' do
  players = Player.where("name LIKE ?", "%#{params[:txt]}%") 
  players.to_json
end

post '/players/:id/update' do
  player = Player.find(params[:id])
  response = {success: false}
  player.name = params[:name]
  player.position = params[:position]
  player.number = params[:number]
  player.height = params[:height]
  player.weight = params[:weight]
  player.dob = params[:dob]
  player.birthplace = params[:birthplace]
  if player.save
    response[:success] = true
  else
    response[:errors] = player.errors.full_messages
  end

  response.to_json
end

get '/players/:id/delete' do
  results = {result: false}
  player = Player.find(params[:id])
  if player.destroy
    results[:result] = true
  end

  results.to_json
end
