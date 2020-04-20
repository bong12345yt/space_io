module.exports = Object.freeze({
  PLAYER_RADIUS: 40, // kích thước con tàu của người chơi vẽ trên màn hình
  PLAYER_MAX_HP: 100, // máu con tàu của người chơi
  PLAYER_SPEED: 400, // tốc độ con tàu của người chơi
  PLAYER_FIRE_COOLDOWN: 0.25, // thời gian hồi khi bắn đạn
  PLAYER_MOUSE_MAX_DISTANCE: 250, // khoảng cách xa nhất từ chuột đến con tàu để tăng giảm tốc độ chạy của con tàu theo ý thích của người chơi

  BULLET_RADIUS: 10, // kích thước viên đạn
  BULLET_SPEED: 800, // tốc độ bay của viên đạn
  BULLET_DAMAGE: 5, // sát thương của viên đạn

  ITEM_MAX_HEATH: 5, // số lượng tối đa của item máu trên bản đồ
  ITEM_HEATH_HP: 30, // số lương máu mà item hồi phục cho con tàu của người chơi khi người chơi nhặt được item này
  ITEM_HEATH_RADIUS: 20, // kích thước của item hồi máu

  ITEM_MAX_GUN: 3, // số lượng khẩu súng con tàu bắn ra tối đa là 3
  ITEM_GUN_BONUS: 1, // mối lần nhặt được item này thì súng/đạn tăng lên 1
  ITEM_GUN_RADIUS: 20, // kích thước của item súng/đạn

  ITEM_MAX_ALIGN_X: 50,
  ITEM_MAX_ALIGN_Y: 50,

  SCORE_BULLET_HIT: 30, //số điểm đạt được khi bắn trúng người chơi khác
  SCORE_PER_SECOND: 1, //số điểm đạt được sau mỗi giây còn sống
  HP_PER_SECOND: 2, // số lượng máu phục hồi sau mỗi giây

  SPARKLING_FRAME_COUNT: 8, // số lượng frame của tia lửa đạn
  SPARKLING_RADIUS: 40, // kích thước của tia lửa đạn khi bắn trúng tàu khi vẽ lên màn hình

  EXPLOSION_FRAME_COUNT: 13, //số lượng frame của hiệu ứng nỗ tàu
  EXPLOSION_RADIUS: 80, // kích thước của hiệu ứng nổ khi vẽ lên màn hình

  BOMB_RADIUS: 50, // kích thước quả bom khi vẽ lên màn hình
  BOMB_DAMAGE_PER_FRAME: 2, // sát thương vùng bom nổ mỗi giây
  BOMB_MAX_NUM_ON_MAP: 15, // số lượng bom tối đa trên bản đồ

  PLANET_FRAME_COUNT: 11, //số lượng frame của (hành tinh/ngôi sao lớn)
  PLANET_WIDTH: 336, // độ rộng khi vẽ (hành tinh/ngôi sao lớn) lên màn hình
  PLANET_HEIGHT: 189, // chiều cao khi vẽ (hành tinh/ngôi sao lớn) lên màn hình

  MAP_SIZE: 5000, // kích thước của bản đồ
  MSG_TYPES: { // các message title khi server gửi cho client hoặc client gửi cho server.
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    MOUSEPOS: 'mousepos',
    GAME_OVER: 'dead',
    INPUT_MOUSE_LEFT_CLICK: 'mouseleftclick',
  },

  ID_BOTS: [
    BOT_ONE = 0,
    BOT_TWO = 1,
    BOT_THREE = 2,
    BOT_FOUR = 3,
    BOT_FINE = 4,
  ],

  NAME_BOTS: [
    BOT_ONE = 'bot_1',
    BOT_TWO = 'bot_2',
    BOT_THREE = 'bot_3',
    BOT_FOUR = 'bot_4',
    BOT_FINE = 'bot_5',
  ],

  SHIP_BOTS: [
    BOT_ONE = 'spritesheet.png',
    BOT_TWO = 'spritesheet2.png',
    BOT_THREE = 'spritesheet3.png',
    BOT_FOUR = 'spritesheet4.png',
    BOT_FINE = 'spritesheet5.png',
  ],

  AMOUNT_OF_BOTS: 5,
});
