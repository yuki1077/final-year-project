package com.educonnect.repositories;

import com.educonnect.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findBySchoolId(Long schoolId);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    List<Order> findByPaymentStatus(Order.PaymentStatus paymentStatus);
    
    @Query("SELECT o FROM Order o JOIN o.items oi WHERE oi.bookId IN " +
           "(SELECT b.id FROM Book b WHERE b.publisherId = :publisherId)")
    List<Order> findOrdersByPublisherId(@Param("publisherId") Long publisherId);
    
    @Query("SELECT SUM(o.total) FROM Order o WHERE o.paymentStatus = 'COMPLETED'")
    BigDecimal calculateTotalRevenue();
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.schoolId = :schoolId")
    long countBySchoolId(@Param("schoolId") Long schoolId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(@Param("status") Order.OrderStatus status);
}





