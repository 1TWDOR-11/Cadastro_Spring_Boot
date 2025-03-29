package com.iaragames.controller;

import com.iaragames.model.Jogo;
import com.iaragames.repository.JogoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jogos")
@CrossOrigin(origins = "*")
public class JogoController {

    @Autowired
    private JogoRepository jogoRepository;

    @GetMapping
    public List<Jogo> listar() {
        return jogoRepository.findAll();
    }

    @PostMapping
    public Jogo criar(@RequestBody Jogo jogo) {
        return jogoRepository.save(jogo);
    }

    @PutMapping("/{id}")
    public Jogo atualizar(@PathVariable Long id, @RequestBody Jogo jogo) {
        jogo.setId(id);
        return jogoRepository.save(jogo);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        jogoRepository.deleteById(id);
    }
}
