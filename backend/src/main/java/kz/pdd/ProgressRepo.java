package kz.pdd;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgressRepo extends JpaRepository<Progress, String> {
    List<Progress> findTop20ByOrderByEarnedDesc();
}
