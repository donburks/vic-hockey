# Homepage (Root path)
get '/' do
  erb :index
end

get '/players' do
  Player.all.to_json	
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

get '/players/:id/delete' do
  results = {result: false}
  player = Player.find(params[:id])
  if player.destroy
    results[:result] = true
  end

  results.to_json
end
