package kz.pdd;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = "spring.datasource.url=jdbc:h2:mem:test")
class ProgressApiTest {
    @Autowired MockMvc mvc;

    @Test void saveThenRank() throws Exception {
        mvc.perform(put("/api/progress/{id}", "test-device-1").contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"Тест\",\"money\":10,\"earned\":500,\"rides\":2,\"clean\":1,\"fines\":0,\"data\":\"{}\"}"))
            .andExpect(status().isOk());
        mvc.perform(get("/api/leaderboard")).andExpect(status().isOk()).andExpect(jsonPath("$[0].name").value("Тест"));
    }

    @Test void rejectsBadId() throws Exception {
        mvc.perform(get("/api/progress/{id}", "bad id!")).andExpect(status().isBadRequest());
    }
}
