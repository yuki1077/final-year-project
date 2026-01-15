package com.educonnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EduConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(EduConnectApplication.class, args);
        System.out.println("\n" +
                "╔═══════════════════════════════════════════╗\n" +
                "║  🚀 EduConnect Backend Started!          ║\n" +
                "║  📚 API: http://localhost:8000/api       ║\n" +
                "║  🔧 Environment: Development             ║\n" +
                "╚═══════════════════════════════════════════╝\n");
    }
}





