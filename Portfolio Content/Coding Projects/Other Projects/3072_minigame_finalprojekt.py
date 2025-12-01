#initialising and importing
import random
import pygame
import keyboard
pygame.init()
pygame.font.init()

#for prooving if pygame starts normally
successes, failures = pygame.init()
print(f"Pygame init: {successes} successes, {failures} failures")

# declaring variables that are used in the code
#tiles and screen size
size = 4
tile_size = 100
gap_size = 10
margin = 20
screen_size = size * tile_size + (size + 1) * gap_size + 2 * margin
screen_width = screen_size
screen_height = screen_size

#colors
background_color = (255,250,250)
empty_tile_color = (255,255,255)
#values connected to colors, all same values have same colors for a good visibility
tile_colors = {
    3: (135,206,250),
    6: (0,191,255),
    12: (70,130,180),
    24: (100,149,237),
    48: (176,224,230),
    96: (30,144,255),
    192: (135,206,235),
    384: (65,105,225),
    768: (72,209,204),
    1536: (0,0,205),
    3072: (0,0,139)
} #blue color set

#fonts
font_color = (245,245,245)
font = pygame.font.SysFont('spacemono', 40)
#for startpage, endpage and scores different sizes of fonts are needed
font_endpage = pygame.font.SysFont('spacemono', 28)
font_startpage = pygame.font.SysFont('spacemono', 30)
font_score = pygame.font.SysFont('spacemono', 16)

#scores
score = 0
high_score = 0


#drawing
#drawing the board
def draw_board(screen, board):
    screen.fill(background_color)
    for row in range(size):
        for col in range(size):
            value = board[row][col]
            x = margin + gap_size + col * (tile_size + gap_size)
            y = 20 + margin + gap_size + row * (tile_size + gap_size) #20 is needed space for displaying the high score
            draw_tile(screen, value, x, y)
    #displaying the scores
    score_text = font_score.render(f"Score: {score}", True, (255, 0, 0))
    highscore_text = font_score.render(f"High Score: {high_score}", True, (255, 0, 0))
    screen.blit(score_text, (30, 20))
    screen.blit(highscore_text, (255, 20))

#calculating the text center    
def calculate_text_center(x, y):
    return x + tile_size / 2, y + tile_size / 2 

#drawing the tiles
def draw_tile(screen, value, x, y):
    color = tile_colors.get(value, (60, 58, 50))
    rect = pygame.Rect(x, y, tile_size, tile_size)
    pygame.draw.rect(screen, color, rect)
    if value != 0:
        text = font.render(str(value), True, font_color)
        text_center = calculate_text_center(x, y)
        text_rect = text.get_rect(center=text_center)
        screen.blit(text, text_rect)

#drawing a start screen
def draw_startpage (screen):
    screen.fill(background_color)
    #displaying the two texts
    text1 = font_startpage.render("3072", True, (255, 0, 0))
    text_rect1 = text1.get_rect(center=(screen_width // 2, screen_height // 3))
    screen.blit(text1, text_rect1)
    text2 = font_startpage.render("press 'p' to start", True, (255, 0, 0))
    text_rect2 = text2.get_rect(center=(screen_width // 2, screen_height // 2))
    screen.blit(text2, text_rect2)
    pygame.display.update()


#adding new random tiles to the game
#finding out where are the empty tiles
def find_empty_tiles(board):
    empty_tiles = [(i, j) for i in range(size) for j in range(size) if board[i][j] == 0]
    return empty_tiles

#choosing a random empty tile
def choose_random_tile(empty_tiles):
    return random.choice(empty_tiles)

#assingning a new value to the new tile
#most of the time the game adds a 3 tile, rarely a 6
def assign_new_value():
    return 3 if random.random() < 0.9 else 6

#adding the new tile
def add_new_tile(board):
    empty_tiles = find_empty_tiles(board)
    if empty_tiles:
        row, col = choose_random_tile(empty_tiles)
        board[row][col] = assign_new_value()


#moving and combining tiles
def slide_row_left(row):
    #creating a new row non zero values from input row
    new_row = [i for i in row if i != 0] 
    #padding the remaining tiles with 0's, so the row length is the same
    new_row += [0] * (size - len(new_row))
    for i in range(size - 1):
        if new_row[i] == new_row[i + 1] and new_row[i] != 0: #if the value is the same
            #the program merges the two number into i*2
            new_row[i] *= 2
            #setting the empty space to 0
            new_row[i + 1] = 0
    new_row = [i for i in new_row if i != 0] #repeating
    new_row += [0] * (size - len(new_row)) #sliding all tiles to left, to avoid empty spaces
    return new_row

#moving left
def move_left(board):
    new_board = []
    for row in board:
        new_board.append(slide_row_left(row))
    return new_board

#moving right
def move_right(board):
    new_board = []
    for row in board:
        new_board.append(slide_row_left(row[::-1])[::-1])
    return new_board

#moving up
def move_up(board):
    new_board = list(zip(*board))
    new_board = move_left(new_board)
    return [list(row) for row in zip(*new_board)]

#moving down
def move_down(board):
    new_board = list(zip(*board))
    new_board = move_right(new_board)
    return [list(row) for row in zip(*new_board)]


#score and high score
#summing the boards total number value = score
def calculate_score(board):
    global score
    score = sum(sum(row) for row in board)

#uptading high score
def update_high_score():
    global high_score
    if score > high_score:
        high_score = score


#chechking for win
def check_win(board):
    for row in board:
        if 3072 in row:
            return True
            break
    return False

#checking for available moves
def check_moves_available(board):
    for row in range(size):
        if 0 in board[row]:
            return True
        #checking horizontally
        for col in range(size - 1):
            if board[row][col] == board[row][col + 1]:
                return True
    for col in range(size):
        #checking verically
        for row in range(size - 1):
            if board[row][col] == board[row + 1][col]:
                return True
    return False 


# game loop and handling events
def main():
    #for debugging and controlling if the game is starting correctly
    print("Main function started")
    screen = pygame.display.set_mode((screen_width, screen_height))
    #for debugging and controlling
    if not screen:
        print('Initialisation failed')
             
    pygame.display.set_caption("3072 Game")
    clock = pygame.time.Clock()

    # Displaying start screen
    draw_startpage(screen)

    waiting_for_start = True
    while waiting_for_start:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                return
            #starting the game if key p is pressed
            elif event.type == pygame.KEYDOWN and event.key == pygame.K_p:
                waiting_for_start = False  # Exiting the start screen loop

    board = [[0] * size for _ in range(size)]
    add_new_tile(board)
    add_new_tile(board)

    running = True
    won = False
    lost = False

    #functions while the game runs
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            #moving the tiles on the board with arrows or a w s d keys
            elif event.type == pygame.KEYDOWN:
                if not won and not lost:
                    if event.key == pygame.K_LEFT or event.key == pygame.K_a:
                        board = move_left(board)
                    elif event.key == pygame.K_RIGHT or event.key == pygame.K_d:
                        board = move_right(board)
                    elif event.key == pygame.K_UP or event.key == pygame.K_w:
                        board = move_up(board)
                    elif event.key == pygame.K_DOWN or event.key == pygame.K_s:
                        board = move_down(board)

                    add_new_tile(board)
                    #if calculate_score happens before add_new_tile the score will be false
                    calculate_score(board)
                    update_high_score()

                    #checking after moving tiles if the player won or lost
                    won = check_win(board)
                    lost = not check_moves_available(board)

                #playing again after 'p' is pressed
                elif (won or lost) and event.key == pygame.K_p:
                    #resetting the board
                    board = [[0] * size for _ in range(size)]
                    add_new_tile(board)
                    add_new_tile(board)
                    won = False
                    lost = False
                    global score
                    score = 0

                #continuing the game if not won or lost
                if not (won or lost):
                    draw_board(screen, board)

        #drawing the board after all functions ran
        draw_board(screen, board)

        #displaying winning or losing text
        if won:
            text1 = font_endpage.render("You won!", True, (255, 0, 0))
            text_rect1 = text1.get_rect(center=(screen_width // 2, screen_height // 3))
            screen.blit(text1, text_rect1)
            text2 = font_endpage.render("Press 'p' to play again", True, (255, 0, 0))
            text_rect2 = text2.get_rect(center=(screen_width // 2, screen_height // 2))
            screen.blit(text2, text_rect2)
        elif lost:
            text3 = font_endpage.render("You lost!", True, (255, 0, 0))
            text_rect3 = text3.get_rect(center=(screen_width // 2, screen_height // 3))
            screen.blit(text3, text_rect3)
            text4 = font_endpage.render("Press 'p' to play again", True, (255, 0, 0))
            text_rect4 = text4.get_rect(center=(screen_width // 2, screen_height // 2))
            screen.blit(text4, text_rect4)

        pygame.display.flip()
        clock.tick(30)

    pygame.quit()
if __name__ == "__main__":
    main()
#without "if __name__ == "__main__": main()" the pygame window does not pop up on my device :(