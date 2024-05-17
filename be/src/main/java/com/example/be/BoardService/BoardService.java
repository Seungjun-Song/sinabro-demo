package com.example.be.BoardService;

import com.example.be.BoardDto.BoardDto;
import com.example.be.BoardEntity.Board;
import com.example.be.BoardRepository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoardService {
    @Autowired
    private BoardRepository boardRepository;

    public List<BoardDto> getAllBoards() {
        return boardRepository.findAll().stream()
            .map(board -> new BoardDto(board.getId(), board.getTitle(), board.getBody()))
            .collect(Collectors.toList());
    }

    public BoardDto getBoardById(Long id) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new RuntimeException("Board not found"));
        return new BoardDto(board.getId(), board.getTitle(), board.getBody());
    }

    public BoardDto createBoard(BoardDto boardDto) {
        Board board = new Board();
        board.setTitle(boardDto.getTitle());
        board.setBody(boardDto.getBody());
        board = boardRepository.save(board);
        return new BoardDto(board.getId(), board.getTitle(), board.getBody());
    }

    public BoardDto updateBoard(Long id, BoardDto boardDto) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new RuntimeException("Board not found"));
        board.setTitle(boardDto.getTitle());
        board.setBody(boardDto.getBody());
        board = boardRepository.save(board);
        return new BoardDto(board.getId(), board.getTitle(), board.getBody());
    }

    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }
}
