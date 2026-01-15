package com.educonnect.repositories;

import com.educonnect.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    List<OrderItem> findByOrderId(Long orderId);
    
    List<OrderItem> findByBookId(Long bookId);
    
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.bookId = :bookId")
    Long getTotalQuantitySoldForBook(@Param("bookId") Long bookId);
    
    @Query("SELECT oi.bookId, SUM(oi.quantity) FROM OrderItem oi GROUP BY oi.bookId ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopSellingBooks();
}





