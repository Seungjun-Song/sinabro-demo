package com.example.be.BoardRepository;

import com.example.be.BoardEntity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {
}
